import { mergeProps } from './TopicFeedHeader.connector'

describe('mergeProps', () => {
  it('should set up toggleSubscribe with no arguments', () => {
    const ownProps = {
      topic: { id: '1' },
      community: { id: '10' },
      communityTopic: { isSubscribed: true }
    }
    const dispatchProps = {
      toggleTopicSubscribe: jest.fn()
    }
    const mergedProps = mergeProps(null, dispatchProps, ownProps)
    mergedProps.toggleSubscribe()
    expect(dispatchProps.toggleTopicSubscribe).toBeCalledWith('1', '10', false)
  })
})
