import { findTopics } from './TopicSelector.store'

describe('findTopics', () => {
  it('queries groupTopics at the top level', () => {
    expect(findTopics('foo')).toMatchSnapshot()
  })
})
