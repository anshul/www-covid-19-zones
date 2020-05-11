export type DateRangeT = 'all' | '1m' | '1w'
export type ModeT = 'zone' | 'compare'

export interface UrlT {
  mode?: ModeT
  codes?: [string]
  dateRange?: DateRangeT
  logScale?: boolean
}
