import Dropdown from './Dropdown'
import { shallow } from 'enzyme'
import React from 'react'

const sampleItems = [
  { label: 'item 1' },
  { label: 'item 2' }
]

it('renders with no items', () => {
  const wrapper = shallow(<Dropdown toggleChildren={<span>click me</span>} />)
  expect(wrapper.children()).toHaveLength(3)
  expect(wrapper.find('span span').text()).toBe('click me')
  expect(wrapper.find('ul')).toBeTruthy()
})

it('renders with items', () => {
  const wrapper = shallow(<Dropdown
    toggleChildren={<span>click me</span>}
    items={sampleItems} />)

  wrapper.find('[data-stylename="dropdown-toggle"]').simulate('click')

  const list = wrapper.find('ul li')
  expect(list).toHaveLength(2)
  expect(list.at(0).text()).toEqual('item 1')
  expect(list.at(1).text()).toEqual('item 2')
})

it('renders with a triangle', () => {
  const wrapper = shallow(<Dropdown
    toggleChildren={<span>hi</span>}
    items={sampleItems}
    triangle />)

  wrapper.find('[data-stylename="dropdown-toggle"]').simulate('click')

  const list = wrapper.find('ul li')
  expect(list).toHaveLength(3)
  expect(list.at(1).text()).toEqual('item 1')
  expect(list.at(2).text()).toEqual('item 2')
})

it('renders with passed-in children', () => {
  const wrapper = shallow(<Dropdown toggleChildren={<span>hi</span>}>
    <li>foo</li>
    <li>bar</li>
  </Dropdown>)

  wrapper.find('[data-stylename="dropdown-toggle"]').simulate('click')

  const list = wrapper.find('ul li')
  expect(list).toHaveLength(2)
  expect(list.at(0).text()).toEqual('foo')
  expect(list.at(1).text()).toEqual('bar')
})

it('renders with passed-in children and a triangle', () => {
  const wrapper = shallow(<Dropdown triangle toggleChildren={<span>hi</span>}>
    <li>foo</li>
    <li>bar</li>
  </Dropdown>)

  wrapper.find('[data-stylename="dropdown-toggle"]').simulate('click')

  const list = wrapper.find('ul li')
  expect(list).toHaveLength(3)
  expect(list.at(1).text()).toEqual('foo')
  expect(list.at(2).text()).toEqual('bar')
})
