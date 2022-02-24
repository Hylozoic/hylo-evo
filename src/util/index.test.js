import { formatDatePair } from './index'
import moment from 'moment-timezone'

describe('formatDatePair', () => {
  it('displays differences of dates', () => {
    const d1 = moment.tz(1551908483315, 'Etc/GMT').month(1).day(1).hour(18)
    const d2 = moment.tz(d1, 'Etc/GMT').hour(21)
    const d3 = moment.tz(d2, 'Etc/GMT').day(2)
    const d4 = moment.tz(d3, 'Etc/GMT').month(2)
    const d5 = moment.tz(d3, 'Etc/GMT').year(2050)

    expect(formatDatePair(d1)).toMatchSnapshot()
    expect(formatDatePair(d1, d2)).toMatchSnapshot()
    expect(formatDatePair(d1, d3)).toMatchSnapshot()
    expect(formatDatePair(d1, d4)).toMatchSnapshot()
    expect(formatDatePair(d1, d5)).toMatchSnapshot()
  })
})
