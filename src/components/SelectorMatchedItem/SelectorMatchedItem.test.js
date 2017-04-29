import { mount, shallow } from 'enzyme'
import React from 'react'

import SelectorMatchedItem from './SelectorMatchedItem'

it('matches last snapshot', () => {
  const wrapper = shallow(<SelectorMatchedItem />)
  expect(wrapper).toMatchSnapshot()
})

it('calls deleteMatch when close button clicked', () => {
  const deleteMatch = jest.fn()
  const wrapper = mount(
    <SelectorMatchedItem deleteMatch={deleteMatch} />
  )
  wrapper.find('span').last().simulate('click')
  expect(deleteMatch).toHaveBeenCalled()
})
