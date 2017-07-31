import Pillbox from './Pillbox'
import { shallow } from 'enzyme'
import React from 'react'
 
it('does something', () => {
  const wrapper = shallow(<Pillbox pills={[{id: 1, label: 'clickable', onClick: () => {}}, {id: 2, label: 'unclickable'}]}/>)
  expect(wrapper).toMatchSnapshot()
})
