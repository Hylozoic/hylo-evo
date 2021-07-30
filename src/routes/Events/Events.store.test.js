import { updateTimeframe } from './Events.store'

describe('updateTimeframe', () => {
  it('should match latest snapshot', () => {
    expect(updateTimeframe('past')).toMatchSnapshot()
  })
})
