import orm from 'store/models'
import { mapStateToProps, mapDispatchToProps, mergeProps } from './TopicFeedHeader.connector'

describe('mapStateToProps', () => {
  it('should have a subscription property', () => {
    const session = orm.session(orm.getEmptyState())
    const state = {
      orm: session.state
    }
    const props = {
      topicName: 'petitions',
      community: {id: '10'}
    }
    expect(mapStateToProps(state, props)).toHaveProperty('subscription')
  })
})

describe('mapDispatchToProps', () => {
  it('should define a function which will issue a dispatch if topic and community are both defined', () => {
    const dispatch = jest.fn()
    const props = {
      topic: {id: '1'},
      community: {id: '10'}
    }
    const existingSubscription = {id: '100'}
    const toggleTopicSubscribe = mapDispatchToProps(dispatch, props).toggleTopicSubscribeMaker(existingSubscription)
    toggleTopicSubscribe()
    expect(dispatch).toHaveBeenCalled()
  })

  it("should define a no-op function if community isn't defined", () => {
    const dispatch = jest.fn()
    const props = {
      topic: {id: '1'}
    }
    const existingSubscription = {id: '100'}
    const toggleTopicSubscribe = mapDispatchToProps(dispatch, props).toggleTopicSubscribeMaker(existingSubscription)
    toggleTopicSubscribe()
    expect(dispatch).not.toHaveBeenCalled()
  })

  it("should define a no-op function if topic isn't defined", () => {
    const dispatch = jest.fn()
    const props = {
      community: {id: '1'}
    }
    const existingSubscription = {id: '100'}
    const toggleTopicSubscribe = mapDispatchToProps(dispatch, props).toggleTopicSubscribeMaker(existingSubscription)
    toggleTopicSubscribe()
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should define a no-op function if neither topic nor community are defined', () => {
    const dispatch = jest.fn()
    const props = {}
    const existingSubscription = {id: '100'}
    const toggleTopicSubscribe = mapDispatchToProps(dispatch, props).toggleTopicSubscribeMaker(existingSubscription)
    toggleTopicSubscribe()
    expect(dispatch).not.toHaveBeenCalled()
  })
})

describe('mergeProps', () => {
  it('should use toggleTopicSubscribeMaker from dispatchProps to make a toggleTopicsubscribe function', () => {
    const ownProps = {
      topic: {id: '1'},
      community: {id: '10'}
    }
    const stateProps = {
      subscription: {}
    }
    const dispatch = jest.fn()
    const dispatchProps = mapDispatchToProps(dispatch, ownProps)
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    mergedProps.toggleTopicSubscribe()
    expect(dispatch).toHaveBeenCalled()
  })
})
