export type DateRangeT = 'all_time' | 'last_30_days' | 'last_7_days'

export const filterData = (dateRange: DateRangeT, data: ReadonlyArray<unknown>) => {
  const dataLength = data.length
  switch (dateRange) {
    case 'all_time':
      return data
    case 'last_30_days':
      const monthRange = dataLength >= 30 ? 30 : dataLength
      return data.slice(dataLength - monthRange)
    case 'last_7_days':
      const weekRange = dataLength >= 7 ? 7 : dataLength
      return data.slice(dataLength - weekRange)
  }
}
