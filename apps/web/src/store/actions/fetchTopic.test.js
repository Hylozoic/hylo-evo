import fetchTopic from './fetchTopic'

describe('fetchTopic', () => {
  it('should match latest snapshot', () => {
    expect(fetchTopic('petitions')).toMatchSnapshot()
  })
})
