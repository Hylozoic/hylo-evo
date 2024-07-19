import { submitFlagContent } from './FlagContent.store'

describe('flagContent', () => {
  it('should match the last snapshot', () => {
    expect(submitFlagContent('other', 'A Reason', { id: 22, type: 'post' })).toMatchSnapshot()
  })
})
