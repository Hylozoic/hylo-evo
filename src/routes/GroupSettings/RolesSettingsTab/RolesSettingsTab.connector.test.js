import { mapStateToProps, mapDispatchToProps } from './RolesSettingsTab.connector'
import orm from 'store/models'

let state
beforeAll(() => {
  const session = orm.session(orm.getEmptyState())
  const group = session.Group.create({ id: '99', slug: 'foo' })
  session.Group.create({ id: '88', slug: 'bar' })

  session.Me.create({
    id: '1',
    memberships: [session.Membership.create({
      id: '345',
      group: group.id
    })]
  })

  session.Person.create({
    id: '1'
  })

  session.Person.create({
    id: '2'
  })

  session.Membership.create({
    id: '355',
    group: group.id,
    person: '2'
  })

  group.update({ moderators: ['1', '2'] })

  state = {
    orm: session.state,
    RoleSettings: []
  }
})

describe('mapStateToProps', () => {
  it('works', () => {
    const props = {
      groupId: '99'
    }

    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('correctly sets up dispatches', () => {
    const dispatch = jest.fn(x => x)
    const props = {
      groupId: 11
    }

    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.addGroupRole({ groupId: 1, role: { name: 'Cook' } })).toMatchSnapshot()
    expect(dispatchProps.addRoleToMember({ personId: 1, roleId: 1, isCommonRole: true })).toMatchSnapshot()
    expect(dispatchProps.fetchStewardSuggestions('autocomplete')).toMatchSnapshot()
    expect(dispatchProps.clearStewardSuggestions()).toMatchSnapshot()
  })
})
