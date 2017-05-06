import PeopleSelectorContacts from './PeopleSelectorContacts'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<PeopleSelectorContacts />)
  expect(wrapper).toMatchSnapshot()
})
