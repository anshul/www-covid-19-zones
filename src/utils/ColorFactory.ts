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

interface Colors {
  [key: number]: string
}

const colorGenerator = (color: string): Colors => {
  const colors: Colors = {}
  for (let i = 1; i < 10; i++) {
    colors[i * 100] = TintAndShades(color, 10 - i, i <= 5 ? 'tint' : 'shade')
  }
  colors[500] = color
  return colors
}

export const slateGrey = colorGenerator(color1)
export const slateBlue = colorGenerator(color2)
export const summerSky = colorGenerator(color3)
export const mountainMeadow = colorGenerator(color4)
export const fireBush = colorGenerator(color5)
export const flamingo = colorGenerator(color6)
export const jaffa = colorGenerator(color7)
export const orchid = colorGenerator(color8)
export const purple = colorGenerator(color9)
