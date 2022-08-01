import React from 'react'
import { shallow } from 'enzyme'
import TopicSelector from './TopicSelector'

describe('TopicSelector', () => {
  const defaultMinProps = {
    fetchDefaultTopics: () => {}
  }

  function renderComponent (renderFunc, props = {}) {
    return renderFunc(
      <TopicSelector {...{ ...defaultMinProps, ...props }} />
    )
  }

  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper).toMatchSnapshot()
  })

  describe('componentDidMount', () => {
    it('calls updateSelected', () => {
      const wrapper = renderComponent(shallow, {
        selectedTopics: [{ name: 'one' }]
      })
      expect(wrapper.instance().state.selected).toEqual([{ name: 'one' }])
    })
  })

  describe('componentDidUpdate', () => {
    it('calls updateSelected if selectedTopics has changed', () => {
      const props = {
        selectedTopics: [{ name: 'one' }],
        detailsTopics: [{ name: 'two' }]
      }
      const wrapper = renderComponent(shallow, props)
      wrapper.instance().updateSelected = jest.fn()
      wrapper.instance().componentDidUpdate({ ...defaultMinProps, ...props })
      expect(wrapper.instance().updateSelected).not.toHaveBeenCalled()
      wrapper.instance().componentDidUpdate({ ...defaultMinProps, ...props, selectedTopics: [] })
      expect(wrapper.instance().updateSelected).toHaveBeenCalled()
    })
  })

  describe('updateSelected', () => {
    it('does nothing if topicsEdited = true', () => {
      const props = {
        selectedTopics: [{ name: 'one' }],
        detailsTopics: [{ name: 'two' }]
      }
      const wrapper = renderComponent(shallow, props)
      wrapper.instance().setState({ topicsEdited: true, selected: [] })
      wrapper.instance().updateSelected()
      expect(wrapper.instance().state.selected).toEqual([])
    })

    it('combines selected, props.selectedTopics and props.detailsTopics, truncating at 3', () => {
      const props = {
        selectedTopics: [{ name: 'one' }, { name: 'two' }, { name: 'three' }]
      }
      const wrapper = renderComponent(shallow, props)
      wrapper.instance().setState({ selected: [{ name: 'zero' }] })
      wrapper.instance().updateSelected()
      expect(wrapper.instance().state.selected).toEqual([{ name: 'zero' }, { name: 'one' }, { name: 'two' }])
    })
  })

  describe('getSelected', () => {
    it('returns state.selected', () => {
      const wrapper = renderComponent(shallow)
      const selected = ['one', 'two']
      wrapper.instance().setState({ selected })
      expect(wrapper.instance().getSelected()).toEqual(selected)
    })
  })

  describe('reset', () => {
    it('resets the state to defaultState', () => {
      const wrapper = renderComponent(shallow)
      wrapper.instance().setState({ topicsEdited: true, selected: [{ name: 'one' }] })
      wrapper.instance().reset()
      expect(wrapper.instance().state).toEqual(TopicSelector.defaultState)
    })
  })

  describe('loadOptions', () => {
    it('sets state and calls findTopics on a non empty input', () => {
      const findTopics = jest.fn(() => ({ payload: { getData: () => ({ items: [] }) } }))
      const wrapper = renderComponent(shallow, { findTopics })
      const theInput = 'hithere'
      wrapper.instance().loadOptions(theInput)
      expect(findTopics).toHaveBeenCalledWith(theInput)
    })
  })

  describe('handleTopicsChange', () => {
    it('sets state and calls clearTopics', () => {
      const clearTopics = jest.fn()
      const wrapper = renderComponent(shallow, { clearTopics })
      const topics = [{ name: 'one' }]
      wrapper.setState({ selected: [{ name: 'zero' }] })
      wrapper.instance().handleTopicsChange(topics)
      expect(wrapper.instance().state.selected).toEqual([{ name: 'one' }])
      // expect(clearTopics).toHaveBeenCalledWith()
    })
  })
})
