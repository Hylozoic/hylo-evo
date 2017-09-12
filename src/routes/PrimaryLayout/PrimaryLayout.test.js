import { MemoryRouter, Redirect } from 'react-router'
import React from 'react'
import { shallow } from 'enzyme'

import orm from 'store/models'
import PrimaryLayout, { redirectIfCommunity, RedirectToCommunity } from './PrimaryLayout'

it('shows nothing for a community route if the community is not loaded', () => {
  const wrapper = shallow(<PrimaryLayout isCommunityRoute />)
  expect(wrapper.name()).toEqual('Loading')
})

it('shows normal children for a community route if the community is loaded', () => {
  const wrapper = shallow(<PrimaryLayout
    isCommunityRoute
    location={{pathname: '/'}}
    community={{id: '1'}} />)
  expect(wrapper.name()).toEqual('div')
})

describe('RedirectToCommunity', () => {
  let session

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
    session.Me.create({ id: '1' })
  })

  it('shows a Loading component if currentUser not set yet', () => {
    const wrapper = shallow(<RedirectToCommunity currentUser={null} />)
    const renderWrapper = shallow(wrapper.props().render())
    expect(renderWrapper.find('[data-styleName="loading-top"]').length).toBe(1)
  })

  it('shows a Loading component if currentUser has no memberships', () => {
    const me = session.Me.first()
    const wrapper = shallow(redirectIfCommunity(me)())
    expect(wrapper.find('[data-styleName="loading-top"]').length).toBe(1)
  })

  it('sets `to` prop of Redirect correctly', () => {
    session.Community.create({ id: '1', slug: 'foo' })
    session.Membership.create({ id: '1', community: '1' })
    const me = session.Me.first()
    me.set('memberships', ['1'])

    const wrapper = shallow(<MemoryRouter>
      {redirectIfCommunity(me)()}
    </MemoryRouter>)

    const expected = '/c/foo'
    const actual = wrapper.find(Redirect).props().to
    expect(actual).toBe(expected)
  })
})
