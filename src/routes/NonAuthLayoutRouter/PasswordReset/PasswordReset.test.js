import React from 'react'
import { shallow } from 'enzyme'
import PasswordReset from './PasswordReset'
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' }
    return Component
  }
}))

describe('Signup', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<PasswordReset />, { disableLifecycleMethods: true })
    expect(wrapper).toMatchSnapshot()
  })
})
