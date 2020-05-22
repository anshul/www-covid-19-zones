import { ResizeObserver } from '@juggle/resize-observer'
import { useEffect, useState, useRef, RefObject } from 'react'

interface InputView {
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}

export interface View<T extends HTMLElement> {
  ref: RefObject<T>
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  width: number
  height: number
  innerWidth: number
  innerHeight: number
}

const useResponsiveView = <T extends HTMLElement>(margins?: InputView): View<T> => {
  const ref = useRef<T>(null)
  const [view, setView] = useState<View<T>>({
    marginTop: 0,
    marginLeft: 0,
    marginBottom: 0,
    marginRight: 0,
    ref,
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    ...(margins || {}),
  })

  useEffect(() => {
    const el = view.ref.current
    if (!el) return

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return
      if (!entries.length) return
      const entry = entries[0]
      if (view.width !== Math.floor(entry.contentRect.width) || view.height !== Math.floor(entry.contentRect.height)) {
        const width = Math.floor(entry.contentRect.width)
        const height = Math.floor(entry.contentRect.height)
        const innerWidth = Math.max(width - view.marginLeft - view.marginRight, 0)
        const innerHeight = Math.max(height - view.marginTop - view.marginBottom, 0)
        setView({ ...view, width, height, innerWidth, innerHeight })
      }
    })
    resizeObserver.observe(el)
    return () => {
      resizeObserver.unobserve(el)
    }
  }, [view])

  return view
}

export default useResponsiveView
