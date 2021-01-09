import { mapStateToProps, mergeProps } from './Navigation.connector'
import orm from 'store/models'

describe('mapStateToProps', () => {
  it('picks up changes to membership.newPostCount', () => {
    const s1 = orm.session(orm.getEmptyState())
    s1.Group.create({ id: '1', slug: 'foo', name: 'Foo' })
    s1.Membership.create({ id: '2', group: '1', newPostCount: 5 })

    const props = {
      match: {
        params: { slug: 'foo' }
      },
      location: {
        pathname: ''
      }
    }

    const FeedList = { fetchPostsParam: {} }

    const stateProps = mapStateToProps({ orm: s1.state, FeedList }, props)
    expect(stateProps.badge).toEqual(5)

    const s2 = orm.session(s1.state)

    s2.Group.withId('1').memberships.first().update({ newPostCount: 0 })

    const stateProps2 = mapStateToProps({ orm: s2.state, FeedList }, props)
    expect(stateProps2.badge).toEqual(0)
  })
})

describe('mergeProps', () => {
  it('merges all the right props', () => {
    const dropPostResultsMaker = jest.fn()
    const stateProps = { badge: 1, groupMembership: { id: 77, group: { id: 2 } } }
    const ownProps = { foo: 1, bar: 2 }
    const resetNewPostCount = jest.fn()
    const dispatchProps = { resetNewPostCount, dropPostResultsMaker }
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps).toMatchSnapshot()
    mergedProps.clearBadge()
    expect(resetNewPostCount).toHaveBeenCalledWith(2, 'Membership')
  })
})
