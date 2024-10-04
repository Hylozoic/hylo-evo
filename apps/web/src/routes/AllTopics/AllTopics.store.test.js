import { deleteGroupTopic } from './AllTopics.store'

describe('deleteGroupTopic', () => {
  it('should match latest snapshot', () => {
    expect(deleteGroupTopic(135)).toMatchSnapshot()
  })
})
