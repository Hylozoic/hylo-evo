import { MemoryRouter, Redirect } from 'react-router'
import React from 'react'
import { shallow } from 'enzyme'
import orm from 'store/models'
import { groupUrl } from 'util/navigation'

import PrimaryLayout, {
  RedirectToGroup
} from './PrimaryLayout'

it('shows NotFound if a currentUser is loaded and the group does not exist', () => {
  const wrapper = shallow(<PrimaryLayout
    isGroupRoute
    currentUser={{}}
    location={{ pathname: '' }} />, { disableLifecycleMethods: true })
  expect(wrapper).toMatchSnapshot()
})

it('shows nothing for a group route if the group and currentUser are not loaded', () => {
  const wrapper = shallow(<PrimaryLayout
    isGroupRoute
    groupPending />, { disableLifecycleMethods: true })
  expect(wrapper).toMatchSnapshot()
})

it('shows normal children for a group route if the group is loaded', () => {
  const wrapper = shallow(<PrimaryLayout
    isGroupRoute
    location={{ pathname: '/', search: '' }}
    group={{ id: '1' }}
    currentUser={{ name: 'Testy Face' }} />, { disableLifecycleMethods: true })
  expect(wrapper.name()).toEqual('Div100vh')
})

describe('RedirectToGroup', () => {
  let session

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
    session.Me.create({ id: '1' })
  })

  it('sets `to` prop of Redirect correctly if currentUser has no memberships', () => {
    const currentUser = session.Me.first()
    const path = '/'
    const wrapper = shallow(<MemoryRouter>
      {RedirectToGroup({ path, currentUser })}
    </MemoryRouter>)
    const expected = '/all'
    const actual = wrapper.find(Redirect).props().to
    expect(actual).toBe(expected)
  })

  it('sets `to` prop of Redirect correctly', () => {
    session.Group.create({ id: '1', slug: 'foo' })
    session.Membership.create({ id: '1', group: '1' })
    const currentUser = session.Me.first()
    currentUser.set('memberships', ['1'])
    const path = '/'
    const wrapper = shallow(<MemoryRouter>
      {RedirectToGroup({ path, currentUser })}
    </MemoryRouter>)
    const actual = wrapper.find(Redirect).props().to
    const expected = groupUrl('foo')
    expect(actual).toBe(expected)
  })
})
