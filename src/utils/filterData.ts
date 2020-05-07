export type DateRangeT = 'all' | '1m' | '1w'

export const filterData = (dateRange: DateRangeT, data: ReadonlyArray<unknown>) => {
  switch (dateRange) {
    case 'all':
      return data
    case '1m':
      if (data.length <= 30) return data
      return data.slice(data.length - 30)
    case '1w':
      if (data.length <= 7) return data
      return data.slice(data.length - 7)
  }
}
