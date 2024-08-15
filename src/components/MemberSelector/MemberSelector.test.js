import React from 'react'
import { shallow } from 'enzyme'
import MemberSelector, { Suggestion } from './MemberSelector'

describe('MemberSelector', () => {
  const defaultMinProps = {
    setMembers: () => {},
    members: []
  }

  function renderComponent (renderFunc, props = {}) {
    return renderFunc(
      <MemberSelector {...{ ...defaultMinProps, ...props }} />
    )
  }

  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper).toMatchSnapshot()
  })

  describe('componentDidMount', () => {
    it('calls setMembers', () => {
      const setMembers = jest.fn()
      renderComponent(shallow, {
        selectedTopics: [{ name: 'one' }],
        detailsTopics: [{ name: 'two' }],
        setMembers
      })
      // expect(wrapper.instance().state.selected).toEqual([{name: 'one'}, {name: 'two'}])
      expect(setMembers).toHaveBeenCalled()
    })
  })

  describe('componentDidUpdate', () => {
    it('calls onChange if members changed', () => {
      const onChange = jest.fn()
      const props = {
        ...defaultMinProps,
        members: [{ id: 1 }, { id: 2 }, { id: 3 }],
        onChange
      }
      const prevProps = {
        ...defaultMinProps,
        members: [{ id: 1 }, { id: 2 }]
      }
      const wrapper = renderComponent(shallow, props)
      wrapper.instance().componentDidUpdate(prevProps)
      expect(onChange).toHaveBeenCalledWith(props.members)
    })

    it('calls setMembers when it should', () => {
      const setMembers = jest.fn()
      const props = {
        ...defaultMinProps,
        initialMembers: [{ id: 1 }, { id: 2 }, { id: 3 }],
        setMembers
      }
      const noChangePrevProps = {
        ...defaultMinProps,
        initialMembers: [{ id: 1 }, { id: 2 }, { id: 3 }]
      }

      const yesChangePrevProps = {
        ...defaultMinProps,
        initialMembers: [{ id: 1 }, { id: 2 }]
      }
      const wrapper = renderComponent(shallow, props)
      setMembers.mockClear()
      wrapper.instance().componentDidUpdate(noChangePrevProps)
      expect(setMembers).not.toHaveBeenCalled()
      wrapper.instance().componentDidUpdate(yesChangePrevProps)
      expect(setMembers).toHaveBeenCalled()
    })
  })

  describe('handleInputChange', () => {
    it('calls setAutocomplete and fetches people', () => {
      const setAutocomplete = jest.fn()
      const fetchPeople = jest.fn()
      const wrapper = renderComponent(shallow, { setAutocomplete, fetchPeople })
      const theInput = 'hithere'
      wrapper.instance().handleInputChange(theInput)
      expect(setAutocomplete).toHaveBeenCalledWith(theInput)
      expect(fetchPeople).toHaveBeenCalledWith({ autocomplete: 'hithere', groupIds: null })
    })
  })

  describe('handleAddition', () => {
    it('calls addMember', () => {
      const addMember = jest.fn()
      const wrapper = renderComponent(shallow, { addMember })
      const person = { name: 'one' }
      wrapper.instance().handleAddition(person)
      expect(addMember).toHaveBeenCalledWith(person)
    })
  })

  describe('handleDelete', () => {
    it('calls removeMember', () => {
      const removeMember = jest.fn()
      const wrapper = renderComponent(shallow, { removeMember })
      const person = { name: 'one' }
      wrapper.instance().handleDelete(person)
      expect(removeMember).toHaveBeenCalledWith(person)
    })
  })
})

describe('Suggestion', () => {
  const defaultMinProps = {
    item: {},
    handleChoice: () => {}
  }

  function renderComponent (renderFunc, props = {}) {
    return renderFunc(
      <Suggestion {...{ ...defaultMinProps, ...props }} />
    )
  }

  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly (with a user)', () => {
    const item = {
      id: 1,
      name: 'Joe Joe',
      avatarUrl: 'face.png'
    }
    const wrapper = renderComponent(shallow, { item })
    expect(wrapper).toMatchSnapshot()
  })
})
