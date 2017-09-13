import { MemoryRouter, Redirect } from 'react-router'
import React from 'react'
import { shallow } from 'enzyme'

import orm from 'store/models'
import
PrimaryLayout,
{
  redirectIfCommunity,
  RedirectToCommunity,
  RedirectToCreateCommunityFlow
} from './PrimaryLayout'

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
    session.Person.create({ id: '1' })
  })

  it('shows a Loading component if currentUser not set yet', () => {
    const wrapper = shallow(<RedirectToCommunity currentUser={null} />)
    const renderWrapper = shallow(wrapper.props().render())
    expect(renderWrapper.find('[data-styleName="loading-top"]').length).toBe(1)
  })

  it('shows a Loading component if currentUser has no memberships', () => {
    const user = session.Person.withId('1')
    const wrapper = shallow(redirectIfCommunity(user)())
    expect(wrapper.find('[data-styleName="loading-top"]').length).toBe(1)
  })

  it('sets `to` prop of Redirect correctly', () => {
    session.Community.create({ id: '1', slug: 'foo' })
    session.Membership.create({ id: '1', community: '1' })
    const user = session.Person.withId('1')
    user.set('memberships', [ '1' ])

    const wrapper = shallow(<MemoryRouter>
      {redirectIfCommunity(user)()}
    </MemoryRouter>)

    const expected = '/c/foo'
    const actual = wrapper.find(Redirect).props().to
    expect(actual).toBe(expected)
  })
})

describe('RedirectToCreateCommunityFlow', () => {
  it('returns null if a signup is in progress', () => {
    const currentUser = {settings: {signupInProgress: true}}
    const wrapper = shallow(<RedirectToCreateCommunityFlow currentUser={currentUser} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('returns null if there are memberships', () => {
    const hasMemberships = true
    const wrapper = shallow(<RedirectToCreateCommunityFlow hasMemberships={hasMemberships} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('returns null if pathname starts with /signup', () => {
    const pathname = '/signup/any-path-here'
    const wrapper = shallow(<RedirectToCreateCommunityFlow pathname={pathname} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('returns null if pathname starts with /create-community', () => {
    const pathname = '/create-community/any-path-here'
    const wrapper = shallow(<RedirectToCreateCommunityFlow pathname={pathname} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('returns a redirect from create community if: signup is complete, a user does not have memberships, and is not already on /signup or /create-community', () => {
    const currentUser = {settings: {signupInProgress: false}}
    const hasMemberships = false
    const pathname = '/'
    const wrapper = shallow(<RedirectToCreateCommunityFlow
      pathname={pathname}
      hasMemberships={hasMemberships}
      currentUser={currentUser}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('redirects to create community if signup is complete, a user does not have memberships, and is not already on /signup or /create-community', () => {
    const currentUser = {settings: {signupInProgress: false}}
    const hasMemberships = false
    const pathname = '/'
    const wrapper = shallow(<RedirectToCreateCommunityFlow
      pathname={pathname}
      hasMemberships={hasMemberships}
      currentUser={currentUser}
    />)
    const expected = '/create-community/name'
    const actual = wrapper.find(Redirect).props().to
    expect(actual).toBe(expected)
  })
})
