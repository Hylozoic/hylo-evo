import React from 'react'
import { shallow } from 'enzyme'
import TagInput from './TagInput'

const defaultMinProps = {
  handleInputChange: () => {}
}

function renderComponent (renderFunc, props = {}) {
  return renderFunc(
    <TagInput {...{ ...defaultMinProps, ...props }} />
  )
}

describe('TagInput', () => {
  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with tags', () => {
    const props = {
      tags: [{ name: 'one', id: 1 }, { name: 'two', id: 2 }]
    }
    const wrapper = renderComponent(shallow, props)
    expect(wrapper).toMatchSnapshot()
  })

  it('adds leading hashtags when flag is set', () => {
    const props = {
      addLeadingHashtag: true,
      tags: [{ name: 'one', id: 1 }, { name: 'two', id: 2 }]
    }
    const wrapper = renderComponent(shallow, props)
    expect(wrapper).toMatchSnapshot()
  })

  describe('resetInput', () => {
    it("sets input.value to '' and calls handleInputChange", () => {
      const handleInputChange = jest.fn()
      const wrapper = renderComponent(shallow, { handleInputChange })
      const input = { current: { value: 'old' } }
      wrapper.instance().input = input
      wrapper.instance().resetInput()
      expect(input.current.value).toEqual('')
      expect(handleInputChange).toHaveBeenCalledWith('')
    })
  })
})
