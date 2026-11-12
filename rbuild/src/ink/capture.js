/**
 * Browser-native snapshots of the visible viewport, used as the ink transition's textures.
 *
 * The reference implementation renders snapshots with html2canvas. rBuild's UI relies on
 * features html2canvas cannot reproduce (gradient text, CSS blur/backdrop filters, 3D
 * transforms, MUI's layered shadows), so here the live DOM is cloned into an SVG
 * <foreignObject> and rasterised by the browser itself. Measured on rBuild's routes this is
 * pixel-accurate and takes ~5–40 ms per viewport.
 *
 * Only the viewport is captured, at the current scroll position, and only right before it is
 * needed, so dynamic React content (form input, live preview, route changes) is always fresh.
 */

const SVG_NS = 'http://www.w3.org/2000/svg'
const DROP_SELECTOR = 'script, noscript, template, iframe, object, embed, link, style, [data-ink-ignore]'

/** Font file URL -> Promise<data URL | null>. Fonts are embedded because SVG images can't fetch. */
const fontCache = new Map()
/** Image URL -> data URL | null (null when the image is cross-origin without CORS). */
const imageCache = new Map()

/** The browser couldn't render the snapshot (no SVG <foreignObject> support). */
export class CaptureError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CaptureError'
  }
}

const isCoarsePointer = () => window.matchMedia('(pointer: coarse)').matches

/** Device-pixel ratio used for both the snapshots and the overlay canvas (reference values). */
export function renderScale() {
  const cap = isCoarsePointer() ? 1.5 : 2
  return Math.min(window.devicePixelRatio || 1, cap)
}

/** Identifies what a snapshot depends on: viewport size, scale and scroll position. */
export function layoutKey(scale) {
  const el = document.documentElement
  return `${el.clientWidth}x${el.clientHeight}@${scale}|${Math.round(window.scrollX)},${Math.round(window.scrollY)}`
}

/** Snapshot of the viewport as it is right now. Resolves to `{ canvas, scale, key, ms }`. */
export async function captureViewport({ scale = renderScale(), maxTextureSize = 4096 } = {}) {
  const t0 = performance.now()
  try {
    await document.fonts?.ready
  } catch {
    // Font loading errors only affect fidelity, not correctness.
  }

  // Synchronous: the clone, the stylesheet text and the key all describe the same instant.
  const root = document.documentElement
  const width = root.clientWidth
  const height = root.clientHeight
  const key = layoutKey(scale)
  const safeScale = Math.min(scale, maxTextureSize / width, maxTextureSize / height)
  const background = pageBackground()
  const clone = cloneViewport(root, width)
  const css = collectCss()

  const fonts = await embeddedFonts()
  let head = clone.querySelector('head')
  if (!head) head = clone.insertBefore(document.createElement('head'), clone.firstChild)
  const style = document.createElement('style')
  style.textContent = `${fonts}\n${css}`
  head.append(style)

  const markup = new XMLSerializer().serializeToString(clone)
  const svg =
    `<svg xmlns="${SVG_NS}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<foreignObject x="0" y="0" width="${width}" height="${height}">${markup}</foreignObject></svg>`
  // A data: URL (not a blob: URL) keeps the canvas origin-clean in Chrome and Safari.
  const image = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`)

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * safeScale))
  canvas.height = Math.max(1, Math.round(height * safeScale))
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = background
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  // No pixel read-back here (it would stall the GPU and de-accelerate the canvas): a tainted
  // canvas is detected when WebGL refuses to upload it (see InkRenderer.upload).
  return { canvas, scale: canvas.width / width, key, ms: performance.now() - t0 }
}

// ---------- clone ----------

function cloneViewport(root, width) {
  const clone = root.cloneNode(true)
  const live = root.getElementsByTagName('*')
  const copy = clone.getElementsByTagName('*')
  // Same tree, same order: copy the state that isn't reflected in attributes.
  for (let i = 0; i < live.length; i++) {
    const src = live[i]
    const dst = copy[i]
    switch (src.tagName) {
      case 'INPUT':
        if (src.type === 'checkbox' || src.type === 'radio') dst.toggleAttribute('checked', src.checked)
        else if (src.type !== 'file') dst.setAttribute('value', src.value)
        break
      case 'TEXTAREA':
        dst.textContent = src.value
        break
      case 'SELECT':
        for (let k = 0; k < src.options.length; k++) dst.options[k]?.toggleAttribute('selected', src.options[k].selected)
        break
      case 'IMG':
        inlineImage(src, dst)
        break
      default:
        break
    }
    if ((src.scrollTop || src.scrollLeft) && src !== document.body) keepInnerScroll(src, dst)
  }
  for (const node of clone.querySelectorAll(DROP_SELECTOR)) node.remove()

  // Emulate the document scroll. `position: sticky` and `fixed` elements resolve against the
  // foreignObject viewport, so headers and floating buttons land where they are on screen.
  clone.style.setProperty('position', 'relative')
  clone.style.setProperty('top', `${-window.scrollY}px`)
  clone.style.setProperty('left', `${-window.scrollX}px`)
  clone.style.setProperty('width', `${width}px`)
  clone.style.setProperty('margin', '0')
  return clone
}

/** Scroll offsets aren't serialisable, so shift the children of scrolled containers instead. */
function keepInnerScroll(src, dst) {
  dst.style.setProperty('overflow', 'hidden')
  for (const child of dst.children) {
    const prev = child.style.transform
    child.style.transform = `translate(${-src.scrollLeft}px, ${-src.scrollTop}px)${prev ? ` ${prev}` : ''}`
  }
}

function inlineImage(src, dst) {
  const url = src.currentSrc || src.src
  if (!url || url.startsWith('data:')) return
  if (!imageCache.has(url)) {
    if (!src.complete || !src.naturalWidth) return
    let data = null
    try {
      const c = document.createElement('canvas')
      c.width = src.naturalWidth
      c.height = src.naturalHeight
      c.getContext('2d').drawImage(src, 0, 0)
      data = c.toDataURL()
    } catch {
      data = null // cross-origin without CORS: it will be missing from the snapshot
    }
    imageCache.set(url, data)
  }
  const data = imageCache.get(url)
  if (data) {
    dst.setAttribute('src', data)
    dst.removeAttribute('srcset')
  }
}

function pageBackground() {
  const transparent = (c) => !c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)'
  const body = getComputedStyle(document.body).backgroundColor
  if (!transparent(body)) return body
  const html = getComputedStyle(document.documentElement).backgroundColor
  return transparent(html) ? '#ffffff' : html
}

// ---------- styles ----------

function collectCss() {
  let css = ''
  for (const sheet of document.styleSheets) {
    if (sheet.disabled) continue
    let rules
    try {
      rules = sheet.cssRules
    } catch {
      continue // cross-origin stylesheet
    }
    let text = ''
    for (const rule of rules) {
      if (!(rule instanceof CSSFontFaceRule)) text += `${rule.cssText}\n`
    }
    const media = sheet.media?.mediaText
    css += media && media !== 'all' ? `@media ${media} {\n${text}}\n` : text
  }
  // Inside <foreignObject> the root element is the <svg>, so :root rules target the cloned <html>.
  return css.replace(/:root\b/g, 'html')
}

const normFamily = (s = '') => s.replace(/["']/g, '').trim().toLowerCase()
const normRange = (s = '') => s.replace(/\s+/g, '').toLowerCase() || 'u+0-10ffff'

/** @font-face rules for every face the page has actually loaded, with the files inlined. */
async function embeddedFonts() {
  const loaded = []
  document.fonts?.forEach((face) => {
    if (face.status === 'loaded') loaded.push(face)
  })
  if (!loaded.length) return ''

  const jobs = []
  for (const sheet of document.styleSheets) {
    let rules
    try {
      rules = sheet.cssRules
    } catch {
      continue
    }
    for (const rule of rules) {
      if (!(rule instanceof CSSFontFaceRule)) continue
      const s = rule.style
      const family = s.getPropertyValue('font-family')
      const range = s.getPropertyValue('unicode-range')
      const used = loaded.some(
        (f) => normFamily(f.family) === normFamily(family) && normRange(f.unicodeRange) === normRange(range),
      )
      if (!used) continue
      const match = /url\(\s*(['"]?)([^'")]+)\1\s*\)/.exec(s.getPropertyValue('src'))
      if (!match) continue
      const url = new URL(match[2], sheet.href || document.baseURI).href
      jobs.push(
        fontDataUrl(url).then(
          (data) =>
            data &&
            `@font-face{font-family:${family};font-style:${s.getPropertyValue('font-style') || 'normal'};` +
              `font-weight:${s.getPropertyValue('font-weight') || 'normal'};` +
              `font-stretch:${s.getPropertyValue('font-stretch') || 'normal'};` +
              `${range ? `unicode-range:${range};` : ''}font-display:block;src:url("${data}")}`,
        ),
      )
    }
  }
  return (await Promise.all(jobs)).filter(Boolean).join('\n')
}

function fontDataUrl(url) {
  let job = fontCache.get(url)
  if (!job) {
    job = fetch(url)
      .then((res) => (res.ok ? res.blob() : null))
      .then((blob) => (blob ? blobToDataUrl(blob) : null))
      .catch(() => null)
    fontCache.set(url, job)
  }
  return job
}

function blobToDataUrl(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null)
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(blob)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new CaptureError('Snapshot image failed to load'))
    img.src = src
  }).then((img) => (img.decode ? img.decode().then(() => img, () => img) : img))
}
