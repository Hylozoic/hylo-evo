import React from 'react'
import { shallow } from 'enzyme'
import Pillbox from './Pillbox'

describe('Pillbox', () => {
  it('renders', () => {
    const wrapper = shallow(<Pillbox pills={[
      { id: 1, label: 'a pill' },
      { id: 2, label: 'another pill' }
    ]} />)
    expect(wrapper).toMatchSnapshot()
  })
})
