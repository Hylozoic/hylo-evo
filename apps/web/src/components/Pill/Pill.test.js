import Pill from './Pill'
import { mount } from 'enzyme'
import React from 'react'

describe('Pill', () => {
  it('renders', () => {
    const node = mount(<Pill id={1} label='mountain climbing' />)
    expect(node).toMatchSnapshot()
  })

  it('renders when editable', () => {
    const node = mount(<Pill id={1} label='mountain climbing' editable />)
    expect(node).toMatchSnapshot()
  })

  it('can be clicked to be removed', () => {
    const onRemove = jest.fn()
    const node = mount(<Pill id={1}
      label='mountain climbing'
      editable
      onRemove={onRemove} />)
    const deletePillIcon = node.find('Icon').first()
    deletePillIcon.simulate('click')
    deletePillIcon.simulate('click')
    expect(onRemove).toBeCalled()
  })
})
