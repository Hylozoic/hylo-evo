import Component from './Component'
import { shallow } from 'enzyme'
import React from 'react'

describe('Component', () => {
  it('does something', () => {
    const wrapper = shallow(<Component />)
    // expect(wrapper.find('element')).toBeTruthy()
  })
})
