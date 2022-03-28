import React from 'react'
import { shallow } from 'enzyme'

import AuthLayoutRouter from './AuthLayoutRouter'

it('shows NotFound if a currentUser is loaded and the group does not exist', () => {
  const wrapper = shallow(
    <AuthLayoutRouter
      isGroupRoute
      currentUser={{ hasRegistered: true }}
      location={{ pathname: '' }}
      routeParams={{ view: '' }}
    />
    , { disableLifecycleMethods: true }
  )
  expect(wrapper).toMatchSnapshot()
})

it('shows nothing for a group route if the group and currentUser are not loaded', () => {
  const wrapper = shallow(
    <AuthLayoutRouter
      currentUserPending
      isGroupRoute
      groupPending
      location={{ pathname: '/', search: '' }}
      routeParams={{ view: '' }}
    />
    , { disableLifecycleMethods: true }
  )
  expect(wrapper).toMatchSnapshot()
})

it('shows normal children for a group route if the group is loaded', () => {
  const wrapper = shallow(
    <AuthLayoutRouter
      currentUser={{ name: 'Testy Face', hasRegistered: true }}
      isGroupRoute
      group={{ id: '1' }}
      location={{ pathname: '/', search: '' }}
      routeParams={{ view: '' }}
    />
    , { disableLifecycleMethods: true }
  )
  expect(wrapper.name()).toEqual('Div100vh')
})
