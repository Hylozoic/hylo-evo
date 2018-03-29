import { deleteCommunityTopic } from './AllTopics.store'

describe('deleteCommunityTopic', () => {
  it('should match latest snapshot', () => {
    expect(deleteCommunityTopic(135)).toMatchSnapshot()
  })
})
