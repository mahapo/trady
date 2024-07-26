import * as takeRight from 'lodash/takeRight'

export function rvoi(candels, count = 20): number {
  const volumes = takeRight(candels, count).map(c => c[5])
  const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length
  const rvoi = volumes[volumes.length - 1] / average(volumes)
  return parseFloat(rvoi.toFixed(3))
}
