export type DateRangeT = 'all_time' | 'last_30_days' | 'last_7_days'

export const filterData = (dateRange: DateRangeT, data: ReadonlyArray<unknown>) => {
  switch (dateRange) {
    case 'all_time':
      return data
    case 'last_30_days':
      if (data.length <= 30) return data
      return data.slice(data.length - 30)
    case 'last_7_days':
      if (data.length <= 7) return data
      return data.slice(data.length - 7)
  }
}
