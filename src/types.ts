export type DateRangeT = 'all' | '1m' | '1w'
export type MapDataT = any

export interface UrlT {
  mode?: string
  codes?: string[]
  dateRange?: DateRangeT
  logScale?: boolean
}
