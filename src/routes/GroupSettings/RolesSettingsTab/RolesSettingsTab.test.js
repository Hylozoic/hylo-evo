import React from 'react'
import { shallow } from 'enzyme'
import RolesSettingsTab, { AddMemberToRole, RoleList } from './RolesSettingsTab'
import { keyMap } from 'util/textInput'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  },
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('RolesSettingsTab', () => {
  it('clears suggestions on unmount', () => {
    const clearStewardSuggestions = jest.fn()
    const wrapper = shallow(<RolesSettingsTab clearStewardSuggestions={clearStewardSuggestions} />)
    wrapper.unmount()
    expect(clearStewardSuggestions).toHaveBeenCalled()
  })
})

describe('RoleList', () => {
  it('renders correctly', () => {
    const props = {
      roleId: 1,
      slug: 'foogroup'
    }

    const wrapper = shallow(<RoleList {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('AddMemberToRole', () => {
  it('renders correctly, and transitions from not adding to adding', () => {
    const wrapper = shallow(<AddMemberToRole />)
    expect(wrapper).toMatchSnapshot()
    wrapper.find('#add-new').simulate('click')
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly when adding with suggestions', () => {
    const suggestions = [
      { id: 1, name: 'Demeter' },
      { id: 2, name: 'Ares' },
      { id: 1, name: 'Hermes' }
    ]
    const wrapper = shallow(<AddMemberToRole suggestions={suggestions} />)
    wrapper.find('#add-new').simulate('click')
    expect(wrapper).toMatchSnapshot()
  })

  it('handles interactions correctly', () => {
    const fetchStewardSuggestions = jest.fn()
    const clearStewardSuggestions = jest.fn()

    const wrapper = shallow(<AddMemberToRole
      fetchStewardSuggestions={fetchStewardSuggestions}
      clearStewardSuggestions={clearStewardSuggestions} />)
    wrapper.find('#add-new').simulate('click')

    const input = wrapper.find('input')

    input.simulate('change', {
      target: { value: 'Artem' }
    })
    expect(fetchStewardSuggestions).toHaveBeenCalledWith('Artem')
    expect(clearStewardSuggestions).not.toHaveBeenCalled()

    fetchStewardSuggestions.mockClear()
    clearStewardSuggestions.mockClear()
    input.simulate('change', {
      target: { value: '' }
    })
    expect(clearStewardSuggestions).toHaveBeenCalled()
    expect(fetchStewardSuggestions).not.toHaveBeenCalled()

    fetchStewardSuggestions.mockClear()
    clearStewardSuggestions.mockClear()
    input.simulate('keyDown', {
      keyCode: keyMap.ENTER
    })

    clearStewardSuggestions.mockClear()
    input.simulate('keyDown', {
      keyCode: keyMap.ENTER
    })
    expect(clearStewardSuggestions).not.toHaveBeenCalled()

    clearStewardSuggestions.mockClear()
    input.simulate('keyDown', {
      keyCode: keyMap.ESC
    })
    expect(clearStewardSuggestions).toHaveBeenCalled()
  })
})
