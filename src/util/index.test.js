import { formatDatePairs } from 'index'

describe('formatDatePairs', () => {
  it('displays differences of dates', () => {
    const d1 = moment(1551908483315).month(1).day(1).hour(18)
    const d2 = moment(d1).hour(21)
    const d3 = moment(d2).day(2)
    const d4 = moment(d3).month(2)

    expect(formatDatePairs(d1)).toMatchSnapshot()
    expect(formatDatePairs(d1, d2)).toMatchSnapshot()
    expect(formatDatePairs(d1, d3)).toMatchSnapshot()
    expect(formatDatePairs(d1, d4)).toMatchSnapshot()
  })
})