import React from 'react'
import { shallow } from 'enzyme'
import ModalSidebar from './ModalSidebar'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

describe('ModalSidebar', () => {
  it('renders correctly without a theme', () => {
    const header = 'header'
    const body = 'body'
    const wrapper = shallow(<ModalSidebar
      header={header}
      body={body}
      onClick={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly with a "Previous" button', () => {
    const header = 'header'
    const body = 'body'
    const theme = {
      sidebarHeader: 'header-theme',
      sidebarText: 'text-theme'
    }
    const wrapper = shallow(<ModalSidebar
      header={header}
      body={body}
      onClick={jest.fn()}
      theme={theme}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
