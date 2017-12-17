import React from 'react'
import { shallow } from 'enzyme'
import Review from './Review'

describe('Review', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Review fetchMySkills={jest.fn()} skills={[]} />)
    expect(wrapper).toMatchSnapshot()
  })
})
