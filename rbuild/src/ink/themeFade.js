/**
 * Plain CSS colour cross-fade, used when the ink can't run: reduced motion, no WebGL2,
 * a failed snapshot, or before the ink engine has loaded (as in the reference).
 * The `theme-fade` class only exists for the duration of a flip (see index.css).
 */
export const CSS_FADE_S = 0.45

let fadeTimer = 0

export function crossFadeTheme(apply) {
  const root = document.documentElement
  root.style.setProperty('--theme-fade', `${CSS_FADE_S}s`)
  root.classList.add('theme-fade')
  apply()
  window.clearTimeout(fadeTimer)
  fadeTimer = window.setTimeout(() => root.classList.remove('theme-fade'), CSS_FADE_S * 1000 + 50)
}
