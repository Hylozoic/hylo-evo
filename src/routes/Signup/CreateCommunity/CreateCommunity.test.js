import React from 'react'
import { shallow } from 'enzyme'
import CreateCommunity from './CreateCommunity'

describe('CreateCommunity', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<CreateCommunity />)
    expect(wrapper).toMatchSnapshot()
  })
})
