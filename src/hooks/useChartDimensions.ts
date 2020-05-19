// @ts-nocheck

import { ResizeObserver } from '@juggle/resize-observer'
import { useEffect, useState } from 'react'
export const useChartDimensions = (ref, passedSettings) => {
  const dimensions = combineChartDimensions(passedSettings)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (dimensions.width && dimensions.height) return dimensions
    const element = ref.current
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return
      if (!entries.length) return
      const entry = entries[0]
      if (width !== entry.contentRect.width) setWidth(entry.contentRect.width)
      if (height !== entry.contentRect.height) setHeight(entry.contentRect.height)
    })
    resizeObserver.observe(element)
    return () => resizeObserver.unobserve(element)
  }, [dimensions, height, ref, width])

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  })
  return newSettings
}

const combineChartDimensions = (dimensions) => {
  const parsedDimensions = {
    ...dimensions,
    marginTop: dimensions.marginTop,
    marginRight: dimensions.marginRight,
    marginBottom: dimensions.marginBottom,
    marginLeft: dimensions.marginLeft,
  }
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
    boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
  }
}
