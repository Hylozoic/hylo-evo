import React from 'react'
import { shallow } from 'enzyme'
import LoginCheck from './LoginCheck'

function MockChild () {
  return null
}

it('shows a loading placeholder', () => {
  const wrapper = shallow(<LoginCheck hasCheckedLogin={false}>
    <MockChild />
  </LoginCheck>)
  expect(wrapper.find('Loading')).toHaveLength(1)
})

it('shows children', () => {
  const wrapper = shallow(<LoginCheck hasCheckedLogin>
    <MockChild />
  </LoginCheck>)
  expect(wrapper.find('MockChild')).toHaveLength(1)
})
