import PersonListItem from './PersonListItem'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const wrapper = shallow(<PersonListItem />)
  expect(wrapper).toMatchSnapshot()
})
