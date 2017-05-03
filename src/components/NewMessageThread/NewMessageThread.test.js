import NewMessageThread from './NewMessageThread'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const wrapper = shallow(<NewMessageThread />)
  expect(wrapper).toMatchSnapshot()
})
