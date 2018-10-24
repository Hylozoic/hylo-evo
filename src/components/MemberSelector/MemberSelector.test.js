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
      <MemberSelector {...{...defaultMinProps, ...props}} />
    )
  }

  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper).toMatchSnapshot()
  })

  describe('componentDidMount', () => {
    it('calls setMembers', () => {
      const setMembers = jest.fn()
      const wrapper = renderComponent(shallow, {
        selectedTopics: [{name: 'one'}],
        detailsTopics: [{name: 'two'}],
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
        members: [{id: 1}, {id: 2}, {id: 3}],
        onChange
      }
      const prevProps = {
        ...defaultMinProps,
        members: [{id: 1}, {id: 2}]
      }
      const wrapper = renderComponent(shallow, props)
      wrapper.instance().componentDidUpdate(prevProps)
      expect(onChange).toHaveBeenCalledWith(props.members)
    })

    it.only('calls setMembers when it should', () => {
      const setMembers = jest.fn()
      const props = {
        ...defaultMinProps,
        initialMembers: [{id: 1}, {id: 2}, {id: 3}],
        setMembers
      }
      const noChangePrevProps = {
        ...defaultMinProps,
        initialMembers: [{id: 1}, {id: 2}, {id: 3}]
      }

      const yesChangePrevProps = {
        ...defaultMinProps,
        initialMembers: [{id: 1}, {id: 2}]
      }
      const wrapper = renderComponent(shallow, props)
      wrapper.instance().componentDidUpdate(noChangePrevProps)
      expect(setMembers).not.toHaveBeenCalled()
      wrapper.instance().componentDidUpdate(yesChangePrevProps)
      expect(setMembers).toHaveBeenCalled()
    })
  })

  describe('updateSelected', () => {
    it('does nothing if topicsEdited = true', () => {
      const props = {
        selectedTopics: [{name: 'one'}],
        detailsTopics: [{name: 'two'}]
      }
      const wrapper = renderComponent(shallow, props)
      wrapper.instance().setState({topicsEdited: true, selected: []})
      wrapper.instance().updateSelected()
      expect(wrapper.instance().state.selected).toEqual([])
    })

    it('combines selected, props.selectedTopics and props.detailsTopics, truncating at 3', () => {
      const props = {
        selectedTopics: [{name: 'one'}],
        detailsTopics: [{name: 'two'}, {name: 'three'}]
      }
      const wrapper = renderComponent(shallow, props)
      wrapper.instance().setState({selected: [{name: 'zero'}]})
      wrapper.instance().updateSelected()
      expect(wrapper.instance().state.selected).toEqual([{name: 'zero'}, {name: 'one'}, {name: 'two'}])
    })
  })

  describe('getSelected', () => {
    it('returns state.selected', () => {
      const wrapper = renderComponent(shallow)
      const selected = ['one', 'two']
      wrapper.instance().setState({selected})
      expect(wrapper.instance().getSelected()).toEqual(selected)
    })
  })

  describe('reset', () => {
    it('resets the state to defaultState', () => {
      const wrapper = renderComponent(shallow)
      wrapper.instance().setState({topicsEdited: true, selected: [{name: 'one'}]})
      wrapper.instance().reset()
      expect(wrapper.instance().state).toEqual(MemberSelector.defaultState)
    })
  })

  describe('handleInputChange', () => {
    it('sets state and calls findTopics on a non empty input', () => {
      const findTopics = jest.fn()
      const wrapper = renderComponent(shallow, { findTopics })
      const theInput = 'hithere'
      wrapper.instance().handleInputChange(theInput)
      expect(wrapper.instance().state.input).toEqual(theInput)
      expect(findTopics).toHaveBeenCalledWith(theInput)
    })

    it('sets state and calls clearTopics on empty input', () => {
      const clearTopics = jest.fn()
      const wrapper = renderComponent(shallow, { clearTopics })
      const theInput = ''
      wrapper.instance().handleInputChange(theInput)
      expect(wrapper.instance().state.input).toEqual(theInput)
      expect(clearTopics).toHaveBeenCalled()
    })
  })

  describe('handleAddition', () => {
    it('sets state and calls clearTopics', () => {
      const clearTopics = jest.fn()
      const wrapper = renderComponent(shallow, { clearTopics })
      const topic = {name: 'one'}
      wrapper.setState({selected: [{name: 'zero'}]})
      wrapper.instance().handleAddition(topic)
      expect(wrapper.instance().state.selected).toEqual([{name: 'zero'}, {name: 'one'}])
      expect(clearTopics).toHaveBeenCalledWith()
    })
  })

  describe('handleDelete', () => {
    it('sets state and calls clearTopics', () => {
      const clearTopics = jest.fn()
      const wrapper = renderComponent(shallow, { clearTopics })
      const topic = {name: 'one'}
      wrapper.setState({selected: [{name: 'zero'}, {name: 'one'}]})
      wrapper.instance().handleDelete(topic)
      expect(wrapper.instance().state.selected).toEqual([{name: 'zero'}])
      expect(wrapper.instance().state.topicsEdited).toEqual(true)
    })
  })
})

describe('Suggestion', () => {
  const defaultMinProps = {
    item: {}
  }

  function renderComponent (renderFunc, props = {}) {
    return renderFunc(
      <Suggestion {...{...defaultMinProps, ...props}} />
    )
  }

  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly (with a topic)', () => {
    const item = {
      name: 'design',
      postsTotal: 250,
      followersTotal: 1200
    }
    const wrapper = renderComponent(shallow, { item })
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly (with a new topic)', () => {
    const item = {
      name: 'design',
      isNew: true
    }
    const wrapper = renderComponent(shallow, { item })
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly (with an error)', () => {
    const item = {
      name: 'there was an error',
      isError: true
    }
    const wrapper = renderComponent(shallow, { item })
    expect(wrapper).toMatchSnapshot()
  })
})
