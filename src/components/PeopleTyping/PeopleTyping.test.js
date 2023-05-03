import PeopleTyping from './PeopleTyping'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

it('does something', () => {
  shallow(<PeopleTyping />)
  // expect(wrapper.find('element')).toBeTruthy()
})
