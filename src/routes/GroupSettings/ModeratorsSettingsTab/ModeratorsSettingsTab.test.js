import ModeratorsSettingsTab, { AddModerator, ModeratorsList } from './ModeratorsSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'
import { keyMap } from 'util/textInput'

describe('ModeratorsSettingsTab', () => {
  it('renders loading if no moderators', () => {
    const wrapper = shallow(<ModeratorsSettingsTab />)
    expect(wrapper).toMatchSnapshot()
  })

  it('clears moderators on unmount', () => {
    const clearModeratorSuggestions = jest.fn()
    const wrapper = shallow(<ModeratorsSettingsTab clearModeratorSuggestions={clearModeratorSuggestions} />)
    wrapper.unmount()
    expect(clearModeratorSuggestions).toHaveBeenCalled()
  })

  it('renders a list of RemovableListItems and AddModerator', () => {
    const moderators = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 }
    ]

    const wrapper = shallow(<ModeratorsSettingsTab moderators={moderators} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('calls removeModerator', () => {
    const props = {
      moderators: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 }
      ],
      slug: 'foogroup',
      removeModerator: jest.fn()
    }
    const wrapper = shallow(<ModeratorsSettingsTab {...props} />)

    wrapper.setState({ moderatorToRemove: 3, isRemoveFromGroup: false })
    wrapper.instance().submitRemoveModerator()
    expect(props.removeModerator).toHaveBeenCalledWith(3, false)
  })
})

describe('ModeratorsList', () => {
  it('renders correctly', () => {
    const props = {
      moderators: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 }
      ],
      slug: 'foogroup'
    }

    const wrapper = shallow(<ModeratorsList {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('AddModerator', () => {
  it('renders correctly, and transitions from not adding to adding', () => {
    const wrapper = shallow(<AddModerator />)
    expect(wrapper).toMatchSnapshot()
    wrapper.simulate('click')
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly when adding with suggestions', () => {
    const suggestions = [
      { id: 1, name: 'Demeter' },
      { id: 2, name: 'Ares' },
      { id: 1, name: 'Hermes' }
    ]
    const wrapper = shallow(<AddModerator moderatorSuggestions={suggestions} />)
    wrapper.setState({ adding: true })
    expect(wrapper).toMatchSnapshot()
  })

  it('handles interactions correctly', () => {
    const fetchModeratorSuggestions = jest.fn()
    const clearModeratorSuggestions = jest.fn()

    const wrapper = shallow(<AddModerator
      fetchModeratorSuggestions={fetchModeratorSuggestions}
      clearModeratorSuggestions={clearModeratorSuggestions} />)
    wrapper.setState({ adding: true })

    const input = wrapper.find('input')

    input.simulate('change', {
      target: { value: 'Artem' }
    })
    expect(fetchModeratorSuggestions).toHaveBeenCalledWith('Artem')
    expect(clearModeratorSuggestions).not.toHaveBeenCalled()

    fetchModeratorSuggestions.mockClear()
    clearModeratorSuggestions.mockClear()
    input.simulate('change', {
      target: { value: '' }
    })
    expect(clearModeratorSuggestions).toHaveBeenCalled()
    expect(fetchModeratorSuggestions).not.toHaveBeenCalled()

    fetchModeratorSuggestions.mockClear()
    clearModeratorSuggestions.mockClear()
    input.simulate('keyDown', {
      keyCode: keyMap.ENTER
    })

    clearModeratorSuggestions.mockClear()
    input.simulate('keyDown', {
      keyCode: keyMap.ENTER
    })
    expect(clearModeratorSuggestions).not.toHaveBeenCalled()

    clearModeratorSuggestions.mockClear()
    input.simulate('keyDown', {
      keyCode: keyMap.ESC
    })
    expect(clearModeratorSuggestions).toHaveBeenCalled()
  })
})
