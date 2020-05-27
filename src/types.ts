export type DateRangeT = 'all' | '1m' | '1w'
export type MapDataT = any // eslint-disable-line

export interface UrlT {
  mode?: string
  codes?: string[]
  dateRange?: DateRangeT
  isLogarithmic?: boolean
}

export interface ChartOptionsT {
  dateRange: DateRangeT
  isLogarithmic: boolean
  setDateRange: (dateRange: DateRangeT) => void
  setIsLogarithmic: (isLogarithmic: boolean) => void
}
