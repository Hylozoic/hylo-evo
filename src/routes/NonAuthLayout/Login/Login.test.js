import Login from './Login'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const wrapper = shallow(<Login />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly with mobile redirect', () => {
  const url = 'some.url'
  const wrapper = shallow(<Login downloadAppUrl={url} location={{ search: '' }} />)
  expect(wrapper).toMatchSnapshot()
})
