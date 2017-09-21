import React from 'react'
import { shallow } from 'enzyme'
import NonAuthRoute, { AUTH_ROUTES_ROOT } from './NonAuthRoute'

describe('NonAuthRoute', () => {
  it(`should redirect to ${AUTH_ROUTES_ROOT} if logged in`, () => {
    const testProps = {isLoggedIn: true}
    const wrapper = shallow(<NonAuthRoute {...testProps} />)
    return expect(wrapper.find('RedirectRoute').props().to).toEqual(AUTH_ROUTES_ROOT)
  })

  it(`should render component if not logged in`, () => {
    const testProps = {isLoggedIn: false}
    const wrapper = shallow(<NonAuthRoute {...testProps} />)
    return expect(wrapper.find('Route').length).toEqual(1)
  })
})
