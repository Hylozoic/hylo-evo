import React from 'react'
import { shallow } from 'enzyme'
import AddLocation from './AddLocation'
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' }
    return Component
  }
}))

describe('AddLocation', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<AddLocation />)
    expect(wrapper).toMatchSnapshot()
  })
})
