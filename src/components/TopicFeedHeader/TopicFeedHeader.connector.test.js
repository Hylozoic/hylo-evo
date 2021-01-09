import { mergeProps } from './TopicFeedHeader.connector'

describe('mergeProps', () => {
  it('should set up toggleGroupTopicSubscribe with no arguments', () => {
    const ownProps = {
      topic: { id: '1' },
      group: { id: '10' },
      groupTopic: { isSubscribed: true }
    }
    const dispatchProps = {
      toggleGroupTopicSubscribe: jest.fn()
    }
    const mergedProps = mergeProps(null, dispatchProps, ownProps)
    mergedProps.toggleSubscribe()
    expect(dispatchProps.toggleGroupTopicSubscribe).toBeCalledWith({ isSubscribed: true })
  })
})
