import { useState, useRef, useLayoutEffect } from 'react'
import Box from '@mui/material/Box'

const A4_WIDTH = 794
const A4_HEIGHT = 1123

const ScaledPage = ({ children, targetWidth, sx = {} }) => {
  const containerRef = useRef(null)
  const scalerRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [pageHeight, setPageHeight] = useState(A4_HEIGHT)

  // A resume longer than one page makes the frame taller instead of being cut off at the first
  // page. `offsetHeight` is the unscaled layout height. Thumbnails clip to one page themselves
  // (.lp-paper); print releases the frame in CSS (.resume-frame in easel.css), without this state.
  useLayoutEffect(() => {
    const el = scalerRef.current
    if (!el) return undefined
    const update = () => setPageHeight(Math.max(A4_HEIGHT, el.offsetHeight))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Layout effect: the scale is applied before the first paint, so a preview never flashes unscaled.
  useLayoutEffect(() => {
    if (targetWidth) {
      setScale(targetWidth / A4_WIDTH)
      return
    }

    const el = containerRef.current
    if (!el) return

    const updateScale = () => {
      const currentWidth = el.clientWidth
      if (currentWidth > 0) {
        // Clamp scale so it doesn't exceed 1 (or can scale down for phones/sidebars)
        const newScale = Math.min(currentWidth / A4_WIDTH, 1)
        setScale(newScale)
      }
    }

    updateScale()

    const observer = new ResizeObserver(() => {
      updateScale()
    })
    observer.observe(el)

    return () => observer.disconnect()
  }, [targetWidth])

  return (
    <Box
      ref={containerRef}
      className="resume-frame"
      sx={{
        width: targetWidth ? `${targetWidth}px` : '100%',
        height: `${Math.ceil(pageHeight * scale)}px`,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        ...sx,
      }}
    >
      <Box
        id="resume-scaler"
        ref={scalerRef}
        sx={{
          width: `${A4_WIDTH}px`,
          minHeight: `${A4_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: targetWidth ? 0 : 'max(0px, calc((100% - 794px * var(--scale, 1)) / 2))',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderRadius: 2,
        }}
        style={{
          '--scale': scale,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default ScaledPage

