import React from 'react'
import { shallow } from 'enzyme'
import WelcomeExplore from './WelcomeExplore'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' }
    return Component
  }
}))

describe('WelcomeExplore', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<WelcomeExplore currentUser={{ name: 'Tibet' }} />)
    expect(wrapper).toMatchSnapshot()
  })
})
