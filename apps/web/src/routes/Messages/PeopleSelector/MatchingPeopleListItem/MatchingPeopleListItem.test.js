import { mount, shallow } from 'enzyme'
import React from 'react'

import MatchingPeopleListItem from './MatchingPeopleListItem'

it('matches last snapshot', () => {
  const wrapper = shallow(<MatchingPeopleListItem />)
  expect(wrapper).toMatchSnapshot()
})

it('calls onClick when close button clicked', () => {
  const onClick = jest.fn()
  const wrapper = mount(
    <MatchingPeopleListItem onClick={onClick} />
  )
  wrapper.find('span').last().simulate('click')
  expect(onClick).toHaveBeenCalled()
})
