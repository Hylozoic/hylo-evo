import { flagContent } from './FlagContent.store'

describe('flagContent', () => {
  it('should match the last snapshot', () => {
    expect(flagContent('other', 'A Reason', {id: 22, type: 'post'})).toMatchSnapshot()
  })
})
