import fetchGroupTopic from './fetchGroupTopic'

describe('fetchGroupTopic', () => {
  it('should match latest snapshot', () => {
    expect(fetchGroupTopic('petitions', 'goteam')).toMatchSnapshot()
  })
})
