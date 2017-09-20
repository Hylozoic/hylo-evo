import React from 'react'
import { shallow } from 'enzyme'
import AuthRoute, {
  STEP_1_SIGNUP_PATH,
  STEP_2_SIGNUP_PATH,
  LOGIN_PATH
} from './AuthRoute'

describe('AuthRoute', () => {
  describe('Logged In', () => {
    it(`redirects to signup step 2 if user is authenticated from ${STEP_1_SIGNUP_PATH}`, () => {
      const testProps = {
        isLoggedIn: true,
        location: {
          pathname: STEP_1_SIGNUP_PATH
        },
        currentUser: null
      }
      const wrapper = shallow(<AuthRoute {...testProps} />)
      return expect(wrapper.find('RedirectRoute').props().to).toEqual(STEP_2_SIGNUP_PATH)
    })

    it('redirects to signup process if the currentUser is marked as being in the signup process', () => {
      const testProps = {
        isLoggedIn: true,
        location: {
          pathname: '/anything-except-signup'
        },
        currentUser: {
          settings: {
            signupInProgress: true
          }
        }
      }
      const wrapper = shallow(<AuthRoute {...testProps} />)
      return expect(wrapper.find('RedirectRoute').props().to).toEqual(STEP_2_SIGNUP_PATH)
    })

    it('forwards to returnToURL and resets if a returnToURL is provided', () => {
      const returnToURL = '/returntome'
      const testProps = {
        isLoggedIn: true,
        location: {
          pathname: '/'
        },
        returnToURL,
        resetReturnToURL: jest.fn()
      }
      const wrapper = shallow(<AuthRoute {...testProps} />)
      expect(testProps.resetReturnToURL.mock.calls.length).toBe(1)
      return expect(wrapper.find('RedirectRoute').props().to).toEqual(returnToURL)
    })
  })

  describe('Not Logged In', () => {
    it(`sets returnToURL and forwards ${LOGIN_PATH} to if matched route requires auth`, () => {
      const testProps = {
        isLoggedIn: false,
        requireAuth: true,
        location: {
          pathname: '/anythingneedingauth',
          search: '?queryparam1=1'
        },
        setReturnToURL: jest.fn()
      }
      const wrapper = shallow(<AuthRoute {...testProps} />)
      expect(testProps.setReturnToURL).toHaveBeenCalledWith(
        testProps.location.pathname + testProps.location.search
      )
      return expect(wrapper.find('RedirectRoute').props().to).toEqual(LOGIN_PATH)
    })

    it('sets returnToURL and renders component if returnToOnAuth is set', () => {
      const testProps = {
        isLoggedIn: false,
        returnToOnAuth: true,
        location: {
          pathname: '/anythingneedingauth',
          search: '?queryparam1=1'
        },
        setReturnToURL: jest.fn(),
        component: (props) => <div>test</div>
      }
      const wrapper = shallow(<AuthRoute {...testProps} />)
      expect(testProps.setReturnToURL).toHaveBeenCalledWith(
        testProps.location.pathname + testProps.location.search
      )
      expect(wrapper.find('RedirectRoute').length).toEqual(0)
      return expect(wrapper.find('Route').length).toEqual(1)
    })
  })

  it('renders component if auth is required and logged-in', () => {
    const testProps = {
      isLoggedIn: true,
      requireAuth: true,
      component: (props) => <div>test</div>
    }
    const wrapper = shallow(<AuthRoute {...testProps} />)
    expect(wrapper.find('RedirectRoute').length).toEqual(0)
    return expect(wrapper.find('Route').length).toEqual(1)
  })

  it('renders component if does not require auth and not logged in', () => {
  })
})
