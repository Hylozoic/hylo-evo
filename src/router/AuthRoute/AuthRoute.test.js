import React from 'react'
import { shallow } from 'enzyme'
import AuthRoute from 'router/AuthRoute/AuthRoute'

export const defaultProps = {
  component: () => {},
  requireAuth: false,
  isLoggedIn: false,
  currentUser: null,
  returnToOnAuth: false,
  setReturnToURL: () => {},
  location: {
    pathname: '/'
  }
}

describe('AuthRoute', () => {
  it('should render component if is logged in and not on the signup url', () => {
    const testProps = {
      ...defaultProps,
      isLoggedIn: true,
      location: {
        pathname: '/notsignup'
      }
    }
    const wrapper = shallow(<AuthRoute {...testProps} />)
    return expect(wrapper).toMatchSnapshot()
  })

  it('should redirect into welcome flow if logged in and on the first signup step', () => {
    const testProps = {
      ...defaultProps,
      isLoggedIn: true,
      location: {
        pathname: '/welcome'
      }
    }
    const wrapper = shallow(<AuthRoute {...testProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should set the URL to return to if not logged in and returnToOnAuth is set', () => {
    const testProps = {
      ...defaultProps,
      isLoggedIn: false,
      returnToOnAuth: true,
      setReturnToURL: jest.fn(),
      location: {
        pathname: '/returnhere',
        search: '?param1=something'
      }
    }
    shallow(<AuthRoute {...testProps} />)
    expect(testProps.setReturnToURL)
      .toHaveBeenCalledWith(testProps.location.pathname + testProps.location.search)
  })

  it('should set the URL to return to and send to login if not logged in and requireAuth is set', () => {
    const testProps = {
      ...defaultProps,
      isLoggedIn: false,
      requireAuth: true,
      setReturnToURL: jest.fn(),
      location: {
        pathname: '/returnhere',
        search: '?param1=something'
      }
    }
    const wrapper = shallow(<AuthRoute {...testProps} />)
    expect(testProps.setReturnToURL)
      .toHaveBeenCalledWith(testProps.location.pathname + testProps.location.search)
    expect(wrapper).toMatchSnapshot()
  })
})
