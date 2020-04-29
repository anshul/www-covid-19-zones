import React from 'react'

interface Props {
  palette: 'paired' | 'normal'
  width?: number
  height?: number
  title?: string
  lineKeys: ReadonlyArray<string>
  xAxisKey: string
  data: any
  legend?: { [lineKey: string]: string }
  logScale?: boolean
}

const CustomLineChart: React.FC<Props> = ({ width, legend, palette, height, title, data, xAxisKey, lineKeys, logScale = false }) => {
  return <p>Chart goes here</p>
}

export default CustomLineChart
