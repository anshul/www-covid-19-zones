import { TintAndShades } from './TintAndShades'

const color1 = '#6b7c93'
const color2 = '#6772e5'
const color3 = '#3297d3'
const color4 = '#24b47e'
const color5 = '#e39f48'
const color6 = '#e25950'
const color7 = '#e37c4c'
const color8 = '#b76ac4'
const color9 = '#8f6ed5'

const lines = ['#4C72B0', '#DD8452', '#55A868', '#C44E52', '#8172B3', '#937860', '#DA8BC3', '#8C8C8C', '#CCB974', '#64B5CD']
const paired = [
  '#A1C9F4',
  '#4C72B0',
  '#8DE5A1',
  '#55A868',
  '#FF9F9B',
  '#C44E52',
  '#D0BBFF',
  '#8172B3',
  '#FFFEA3',
  '#CCB974',
  '#B9F2F0',
  '#64B5CD',
]

interface Colors {
  [key: number]: string
}

export const pickTextColor = (bgColor: string, lightColor = '#fff', darkColor = '#000'): string => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor
  const r = parseInt(color.substring(0, 2), 16) // hexToR
  const g = parseInt(color.substring(2, 4), 16) // hexToG
  const b = parseInt(color.substring(4, 6), 16) // hexToB
  const uicolors = [r / 255, g / 255, b / 255]
  const c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92
    }
    return Math.pow((col + 0.055) / 1.055, 2.4)
  })
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  return L > 0.2 ? darkColor : lightColor
  // return L > 0.179 ? darkColor : lightColor
}

export const colorGenerator = (color: string): Colors => {
  const colors: Colors = {}
  for (let i = 1; i < 10; i++) {
    colors[i * 100] = TintAndShades(color, 10 - i, i <= 5 ? 'tint' : 'shade')
  }
  colors[500] = color
  return colors
}

export const pairedColors = paired.map((color) => colorGenerator(color))
export const lineColors = lines.map((color) => colorGenerator(color))
export const slateGrey = colorGenerator(color1)
export const slateBlue = colorGenerator(color2)
export const summerSky = colorGenerator(color3)
export const mountainMeadow = colorGenerator(color4)
export const fireBush = colorGenerator(color5)
export const flamingo = colorGenerator(color6)
export const jaffa = colorGenerator(color7)
export const orchid = colorGenerator(color8)
export const purple = colorGenerator(color9)
