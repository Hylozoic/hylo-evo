import { MemoryRouter, Redirect } from 'react-router'
import React from 'react'
import { shallow } from 'enzyme'
import orm from 'store/models'
import PrimaryLayout, {
  RedirectToCommunity
} from './PrimaryLayout'

it('shows NotFound if a currentUser is loaded and the community does not exist', () => {
  const wrapper = shallow(<PrimaryLayout
    isCommunityRoute
    currentUser={{}}
    location={{ pathname: '' }} />, { disableLifecycleMethods: true })
  expect(wrapper).toMatchSnapshot()
})

it('shows nothing for a community route if the community and currentUser are not loaded', () => {
  const wrapper = shallow(<PrimaryLayout
    isCommunityRoute
    communityPending />, { disableLifecycleMethods: true })
  expect(wrapper).toMatchSnapshot()
})

it('shows normal children for a community route if the community is loaded', () => {
  const wrapper = shallow(<PrimaryLayout
    isCommunityRoute
    location={{ pathname: '/', search: '' }}
    community={{ id: '1' }}
    currentUser={{}} />, { disableLifecycleMethods: true })
  expect(wrapper.name()).toEqual('div')
})

describe('RedirectToCommunity', () => {
  let session

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
    session.Me.create({ id: '1' })
  })

  it('sets `to` prop of Redirect correctly if currentUser has no memberships', () => {
    const currentUser = session.Me.first()
    const path = '/'
    const wrapper = shallow(<MemoryRouter>
      {RedirectToCommunity({ path, currentUser })}
    </MemoryRouter>)
    const expected = '/all'
    const actual = wrapper.find(Redirect).props().to
    expect(actual).toBe(expected)
  })

  it('sets `to` prop of Redirect correctly', () => {
    session.Community.create({ id: '1', slug: 'foo' })
    session.Membership.create({ id: '1', community: '1' })
    const currentUser = session.Me.first()
    currentUser.set('memberships', ['1'])
    const path = '/'
    const wrapper = shallow(<MemoryRouter>
      {RedirectToCommunity({ path, currentUser })}
    </MemoryRouter>)
    const actual = wrapper.find(Redirect).props().to
    const expected = '/c/foo'
    expect(actual).toBe(expected)
  })
})
