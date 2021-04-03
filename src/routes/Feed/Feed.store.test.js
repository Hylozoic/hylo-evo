import { fetchGroupTopic, fetchTopic } from './Feed.store'

describe('fetchGroupTopic', () => {
  it('should match latest snapshot', () => {
    expect(fetchGroupTopic('petitions', 'goteam')).toMatchSnapshot()
  })
})

describe('fetchTopic', () => {
  it('should match latest snapshot', () => {
    expect(fetchTopic('petitions')).toMatchSnapshot()
  })
})
