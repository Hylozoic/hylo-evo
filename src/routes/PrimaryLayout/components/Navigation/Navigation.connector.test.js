import { mapStateToProps } from './Navigation.connector'
import orm from 'store/models'

describe('mapStateToProps', () => {
  it('picks up changes to membership.newPostCount', () => {
    const s1 = orm.session(orm.getEmptyState())
    s1.Community.create({id: '1', slug: 'foo', name: 'Foo'})
    s1.Membership.create({id: '2', community: '1', newPostCount: 5})

    const props = {
      match: {
        params: {slug: 'foo'}
      }
    }

    const stateProps = mapStateToProps({orm: s1.state}, props)
    expect(stateProps.homeBadge).toEqual(5)

    const s2 = orm.session(s1.state)

    s2.Community.withId('1').memberships.first().update({newPostCount: 0})

    const stateProps2 = mapStateToProps({orm: s2.state}, props)
    expect(stateProps2.homeBadge).toEqual(0)
  })
})
