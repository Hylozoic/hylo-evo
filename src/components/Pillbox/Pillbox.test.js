import Pillbox, { Pill } from './Pillbox'
import { shallow, mount } from 'enzyme'
import React from 'react'

describe('Pillbox', () => {
  it('renders', () => {
    const wrapper = shallow(<Pillbox pills={[
      { id: 1, label: 'clickable', onClick: () => {} },
      { id: 2, label: 'unclickable' }
    ]} />)
    expect(wrapper).toMatchSnapshot()
  })
})

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
