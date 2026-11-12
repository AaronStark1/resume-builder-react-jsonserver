import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'

const A4_WIDTH = 794
const A4_HEIGHT = 1123

const ScaledPage = ({ children, targetWidth, sx = {} }) => {
  const containerRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
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
      sx={{
        width: targetWidth ? `${targetWidth}px` : '100%',
        height: `${Math.ceil(A4_HEIGHT * scale)}px`,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <Box
        id="resume-scaler"
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
