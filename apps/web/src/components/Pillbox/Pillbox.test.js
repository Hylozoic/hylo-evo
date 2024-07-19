import React from 'react'
import { shallow } from 'enzyme'
import Pillbox from './Pillbox'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('Pillbox', () => {
  it('renders', () => {
    const wrapper = shallow(<Pillbox pills={[
      { id: 1, label: 'a pill' },
      { id: 2, label: 'another pill' }
    ]} />)
    expect(wrapper).toMatchSnapshot()
  })
})
