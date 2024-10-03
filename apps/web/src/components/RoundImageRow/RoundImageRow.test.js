import RoundImageRow from './RoundImageRow'
import { shallow } from 'enzyme'
import React from 'react'

it('displays a RoundImage for every url', () => {
  const wrapper = shallow(<RoundImageRow imageUrls={['1.png', '2.png', '3.png', '4.png']} />)
  expect(wrapper.find('RoundImage').length).toEqual(4)
})
