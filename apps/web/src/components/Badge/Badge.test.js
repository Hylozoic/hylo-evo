import Badge from './component'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const props = {
    number: 7,
    expanded: true,
    onClick: () => {}
  }
  const wrapper = shallow(<Badge {...props} />)
  expect(wrapper).toMatchSnapshot()
})
