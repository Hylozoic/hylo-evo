import React from 'react'
import EventRSVP from './EventRSVP'
import { RESPONSES } from 'store/models/EventInvitation'
import { shallow } from 'enzyme'

it('renders correctly with YES response', () => {
  const props = {
    myEventResponse: RESPONSES.YES
  }
  const wrapper = shallow(<EventRSVP {...props} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly with INTERESTED response', () => {
  const props = {
    myEventResponse: RESPONSES.INTERESTED
  }
  const wrapper = shallow(<EventRSVP {...props} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly with NO response', () => {
  const props = {
    myEventResponse: RESPONSES.NO
  }
  const wrapper = shallow(<EventRSVP {...props} />)
  expect(wrapper).toMatchSnapshot()
})
