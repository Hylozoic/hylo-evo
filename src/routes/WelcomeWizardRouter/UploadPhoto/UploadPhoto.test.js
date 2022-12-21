import React from 'react'
import { shallow } from 'enzyme'
import UploadPhoto from './UploadPhoto'
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' }
    return Component
  }
}))
describe('UploadPhoto', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<UploadPhoto />)
    expect(wrapper).toMatchSnapshot()
  })
})
