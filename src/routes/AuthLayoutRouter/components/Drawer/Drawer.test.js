import React from 'react'
import { history } from 'router'
import { shallow } from 'enzyme'
import orm from 'store/models'
import extractModelsFromAction from 'store/reducers/ModelExtractor/extractModelsFromAction'
import { AllTheProviders, generateStore, render, screen } from 'util/reactTestingLibraryExtended'
import Drawer, { ContextRow } from './Drawer'

const fooGroup = {
  id: '11',
  slug: 'foo',
  name: 'Foomunity',
  avatarUrl: '/foo.png'
}

const barGroup = {
  id: '22',
  slug: 'bar',
  name: 'Barmunity',
  avatarUrl: '/bar.png'
}

function currentUserWithGroupsProvider () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }
  const meWithMembershipResult = {
    payload: {
      data: {
        me: {
          id: '1',
          name: 'Test User',
          hasRegistered: true,
          emailValidated: true,
          settings: {
            signupInProgress: false
          },
          memberships: [
            {
              id: '2',
              person: {
                id: '1'
              },
              newPostCount: 0,
              group: fooGroup
            },
            {
              id: '3',
              person: {
                id: '1'
              },
              newPostCount: 7,
              group: barGroup
            }
          ]
        }
      }
    },
    meta: {
      extractModel: 'Me'
    }
  }
  extractModelsFromAction(meWithMembershipResult, ormSession)

  const store = generateStore(history, reduxState)

  return AllTheProviders(store)
}

const match = {
  match: {
    params: {
      context: 'groups',
      groupSlug: 'slug'
    }
  }
}

it('shows groups for current user', () => {
  render(
    <Drawer match={match} />,
    null,
    currentUserWithGroupsProvider()
  )

  expect(screen.getByText(fooGroup.name)).toBeInTheDocument()
  expect(screen.getByText(barGroup.name)).toBeInTheDocument()
})

describe('ContextRow', () => {
  it('renders with zero new posts', () => {
    const wrapper = shallow(<ContextRow group={fooGroup} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders with new posts', () => {
    const wrapper = shallow(<ContextRow group={barGroup} />)
    expect(wrapper).toMatchSnapshot()
  })
})
