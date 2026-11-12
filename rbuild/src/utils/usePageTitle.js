import { useEffect } from 'react'

export const usePageTitle = (title) => {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} — rBuild` : 'rBuild — Smart Resume Builder'
    return () => {
      document.title = prev
    }
  }, [title])
}

