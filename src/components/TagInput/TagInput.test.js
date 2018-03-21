import React from 'react'
import { shallow } from 'enzyme'
import TagInput from './TagInput'

const defaultMinProps = {
  handleInputChange: () => {}
}

function renderComponent (renderFunc, props = {}) {
  return renderFunc(
    <TagInput {...{...defaultMinProps, ...props}} />
  )
}

describe('TagInput', () => {
  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper).toMatchSnapshot()
  })

  describe('resetInput', () => {
    const handleInputChange = jest.fn()
    const wrapper = renderComponent(shallow, { handleInputChange })
    const input = {value: 'old'}
    wrapper.instance().input = input
    wrapper.instance().resetInput()
    expect(input.value).toEqual('')
    expect(handleInputChange).toHaveBeenCalledWith('')
  })
})
