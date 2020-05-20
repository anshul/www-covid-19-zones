export type DateRangeT = 'all' | '1m' | '1w'
export type MapDataT = any // eslint-disable-line

export interface UrlT {
  mode?: string
  codes?: string[]
  dateRange?: DateRangeT
  logScale?: boolean
}
