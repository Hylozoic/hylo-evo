import orm from 'store/models'
import { GROUP_ACCESSIBILITY } from 'store/models/Group'
import { MODULE_NAME } from './CreateGroup.store'
import {
  mapStateToProps,
  mapDispatchToProps
} from './CreateGroup.connector'

const defaultProps = {
  match: {
    params: {
      context: 'group',
      groupSlug: 'moderatorgroup'
    }
  },
  location: {
    search: ''
  }
}

describe('CreateGroup.connector', () => {
  describe('mapStateToProps', () => {
    let state

    beforeAll(() => {
      const session = orm.session(orm.getEmptyState())

      session.Me.create({
        id: '1'
      })

      state = {
        orm: session.state
      }
    })

    it('groupSlugExists is false when there is not a key', () => {
      state[MODULE_NAME] = {}
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.groupSlugExists).toBeFalsy()
    })

    it('groupSlugExists true when there is a slugExists key', () => {
      state[MODULE_NAME] = {
        slugExists: true
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.groupSlugExists).toBeTruthy()
    })

    it('gets the default name and slug from the querystring', () => {
      const props = { ...defaultProps,
        location: {
          search: '?name=weird&slug=banana'
        }
      }
      const actual = mapStateToProps(state, props)
      expect(actual.initialGroupName).toEqual('weird')
      expect(actual.initialGroupSlug).toEqual('banana')
    })

    it('gets correct parentGroupOptions', () => {
      const session = orm.session(orm.getEmptyState())

      session.Group.create({ id: 33, slug: 'moderatorgroup', name: 'I moderate this group' })
      session.Group.create({ id: 34, slug: 'opengroup', accessibility: GROUP_ACCESSIBILITY.Open, name: 'Open Group' })
      session.Group.create({ id: 35, slug: 'notthisgroup', name: 'I dont moderate this closed group' })
      session.Me.create({ id: 1,
        memberships: [session.Membership.create({
          id: '345',
          group: 33,
          hasModeratorRole: true
        }),
        session.Membership.create({
          id: '346',
          group: 34
        }),
        session.Membership.create({
          id: '347',
          group: 35
        })]
      })

      state = {
        orm: session.state
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.parentGroupOptions.length).toEqual(2)
      expect(actual.parentGroups.length).toEqual(1)
    })
  })

  describe('mapDispatchToProps', () => {
    it('maps the action generators', () => {
      const dispatch = jest.fn(x => x)
      const dispatchProps = mapDispatchToProps(dispatch, defaultProps)
      expect(dispatchProps).toMatchSnapshot()
    })
  })
})
