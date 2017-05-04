import { mount, shallow } from 'enzyme'
import React from 'react'

import SelectorMatchedItem from './SelectorMatchedItem'

it('matches last snapshot', () => {
  const wrapper = shallow(<SelectorMatchedItem />)
  expect(wrapper).toMatchSnapshot()
})

it('calls removeParticipant when close button clicked', () => {
  const removeParticipant = jest.fn()
  const wrapper = mount(
    <SelectorMatchedItem removeParticipant={removeParticipant} />
  )
  wrapper.find('span').last().simulate('click')
  expect(removeParticipant).toHaveBeenCalled()
})
