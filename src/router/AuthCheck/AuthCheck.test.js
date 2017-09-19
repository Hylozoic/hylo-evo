import React from 'react'
import { shallow } from 'enzyme'
import AuthCheck from './AuthCheck'

function MockChild () {
  return null
}

it('shows a loading placeholder', () => {
  const wrapper = shallow(<AuthCheck hasCheckedLogin={false}>
    <MockChild />
  </AuthCheck>)
  expect(wrapper.find('Loading')).toHaveLength(1)
})

it('shows children', () => {
  const wrapper = shallow(<AuthCheck hasCheckedLogin>
    <MockChild />
  </AuthCheck>)
  expect(wrapper.find('MockChild')).toHaveLength(1)
})
