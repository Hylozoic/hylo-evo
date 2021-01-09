import { mapStateToProps, mapDispatchToProps } from './ModeratorsSettingsTab.connector'
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
      group: group.id,
      hasModeratorRole: true
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
    person: '2',
    hasModeratorRole: true
  })

  group.update({ moderators: ['1', '2'] })

  state = {
    orm: session.state,
    ModeratorsSettings: []
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
    expect(dispatchProps.addModerator(10)).toMatchSnapshot()
    expect(dispatchProps.removeModerator(10, true)).toMatchSnapshot()
    expect(dispatchProps.fetchModeratorSuggestions('autocomplete')).toMatchSnapshot()
    expect(dispatchProps.clearModeratorSuggestions()).toMatchSnapshot()
  })
})
