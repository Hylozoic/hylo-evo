import { fetchCommunityTopic, fetchTopic } from './Feed.store'

describe('fetchCommunityTopic', () => {
  it('should match latest snapshot', () => {
    expect(fetchCommunityTopic('petitions', 'goteam')).toMatchSnapshot()
  })
})

describe('fetchTopic', () => {
  it('should match latest snapshot', () => {
    expect(fetchTopic('petitions')).toMatchSnapshot()
  })
})
