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
      return expect(
        wrapper.find('Route')
        .props(testProps)
        .render().props.to
      ).toEqual(STEP_2_SIGNUP_PATH)
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
      return expect(
        wrapper.find('Route')
        .props(testProps)
        .render().props.to
      ).toEqual(STEP_2_SIGNUP_PATH)
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
      return expect(
        wrapper.find('Route')
        .props(testProps)
        .render().props.to
      ).toEqual(returnToURL)
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
      return expect(
        wrapper.find('Route')
        .props(testProps)
        .render().props.to
      ).toEqual(LOGIN_PATH)
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
      console.log(wrapper.find('Route')
      .props(testProps)
      .render().debug())

      return expect(
        wrapper.find('Route')
        .props(testProps)
        .render()
      ).toEqual(1)
    })
  })

  it('renders component if auth is required and logged-in', () => {
  })

  it('renders component if does not require auth and not logged in', () => {
  })
})

// component,
// requireAuth,
// isLoggedIn,
// currentUser,
// returnToOnAuth,
// returnToURL,
// setReturnToURL,
// resetReturnToURL,
// location,
// ...rest

// const renderWithRedirectionExpectation = ({ withProps, shouldRedirectTo }) => {
//   const wrapper = shallow(<AuthRoute {...withProps} />)
//   return expect(
//     wrapper.find('Route')
//     .props(withProps)
//     .render().props.to
//   ).toEqual(shouldRedirectTo)
// }

// function MockChild () {
//   return null
// }

// if (isLoggedIn) {
//   if (onInitialSignupStep || (signupInProgress && !isOnSignupPath)) {
//     return <Route {...rest} render={props => <Redirect to={nextSignupStepPath} />} />
//   }
//   if (returnToURL && !signupInProgress) {
//     resetReturnToURL()
//     return <Route {...rest} render={props => <Redirect to={returnToURL} />} />
//   }
// } else {
//   if (requireAuth || returnToOnAuth) {
//     setReturnToURL(location.pathname + location.search)
//   }
//   if (requireAuth) {
//     return <Route {...rest} render={props => <Redirect to={'/login'} />} />
//   }
// }
// return <Route {...rest} render={props => React.createElement(component, props)} />

// isLoggedIn: getIsLoggedIn(state),
// returnToURL: getReturnToURL(state),
// currentUser: getMe(state),
// setReturnToURL: path => dispatch(setReturnToURL(path)),
// resetReturnToURL: () => dispatch(resetReturnToURL())







// it('shows a loading placeholder', () => {
//   const wrapper = shallow(<AuthRoute hasCheckedLogin={false}>
//     <MockChild />
//   </AuthRoute>)
//   expect(wrapper.find('Loading')).toHaveLength(1)
// })
//
// it('shows children', () => {
//   const wrapper = shallow(<AuthRoute hasCheckedLogin>
//     <MockChild />
//   </AuthRoute>)
//   expect(wrapper.find('MockChild')).toHaveLength(1)
// })
//
// it('fetchs the currentUser if logged in and not yet fetched', () => {
//   const testProps = {
//     isLoggedIn: false,
//     fetchForCurrentUser: jest.fn(),
//     location: {
//       pathname: '/apath'
//     }
//   }
//   const wrapper = shallow(<AuthRoute {...testProps} />)
//   expect(testProps.fetchForCurrentUser.mock.calls.length).toEqual(0)
//   wrapper.setProps({isLoggedIn: true})
//   expect(testProps.fetchForCurrentUser.mock.calls.length).toEqual(1)
// })
//
// it('fetchs the currentUser (skipping topics) if logged in and not yet fetched', () => {
//   const testProps = {
//     isLoggedIn: false,
//     fetchForCurrentUser: jest.fn(),
//     location: {
//       pathname: '/notall'
//     }
//   }
//   const wrapper = shallow(<AuthRoute {...testProps} />)
//   expect(testProps.fetchForCurrentUser.mock.calls.length).toEqual(0)
//   wrapper.setProps({isLoggedIn: true})
//   expect(testProps.fetchForCurrentUser).toHaveBeenCalledWith(true)
// })
//
// it('fetchs the currentUser (not skipping topics) if on "/all", logged in and not yet fetched', () => {
//   const testProps = {
//     isLoggedIn: false,
//     fetchForCurrentUser: jest.fn(),
//     location: {
//       pathname: '/all'
//     }
//   }
//   const wrapper = shallow(<AuthRoute {...testProps} />)
//   expect(testProps.fetchForCurrentUser.mock.calls.length).toEqual(0)
//   wrapper.setProps({isLoggedIn: true})
//   expect(testProps.fetchForCurrentUser).toHaveBeenCalledWith(false)
// })
