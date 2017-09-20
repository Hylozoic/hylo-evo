import React from 'react'
import { shallow } from 'enzyme'
import AuthCheck from './AuthCheck'

function MockChild () {
  return null
}

it('shows a loading placeholder', () => {
  const wrapper = shallow(<AuthCheck hasCheckedLogin={false}>
    <MockChild />
  </AuthCheck>)
  expect(wrapper.find('Loading')).toHaveLength(1)
})

it('shows children', () => {
  const wrapper = shallow(<AuthCheck hasCheckedLogin>
    <MockChild />
  </AuthCheck>)
  expect(wrapper.find('MockChild')).toHaveLength(1)
})

it('fetchs the currentUser if logged in and not yet fetched', () => {
  const testProps = {
    isLoggedIn: false,
    fetchForCurrentUser: jest.fn(),
    location: {
      pathname: '/apath'
    }
  }
  const wrapper = shallow(<AuthCheck {...testProps} />)
  expect(testProps.fetchForCurrentUser.mock.calls.length).toEqual(0)
  wrapper.setProps({isLoggedIn: true})
  expect(testProps.fetchForCurrentUser.mock.calls.length).toEqual(1)
})

it('fetchs the currentUser (skipping topics) if logged in and not yet fetched', () => {
  const testProps = {
    isLoggedIn: false,
    fetchForCurrentUser: jest.fn(),
    location: {
      pathname: '/notall'
    }
  }
  const wrapper = shallow(<AuthCheck {...testProps} />)
  expect(testProps.fetchForCurrentUser.mock.calls.length).toEqual(0)
  wrapper.setProps({isLoggedIn: true})
  expect(testProps.fetchForCurrentUser).toHaveBeenCalledWith(true)
})

it('fetchs the currentUser (not skipping topics) if on "/all", logged in and not yet fetched', () => {
  const testProps = {
    isLoggedIn: false,
    fetchForCurrentUser: jest.fn(),
    location: {
      pathname: '/all'
    }
  }
  const wrapper = shallow(<AuthCheck {...testProps} />)
  expect(testProps.fetchForCurrentUser.mock.calls.length).toEqual(0)
  wrapper.setProps({isLoggedIn: true})
  expect(testProps.fetchForCurrentUser).toHaveBeenCalledWith(false)
})
