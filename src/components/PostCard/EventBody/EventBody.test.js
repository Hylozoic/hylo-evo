import React from 'react'
import { shallow } from 'enzyme'
import EventBody from './EventBody'
import moment from 'moment-timezone'

describe('EventBody', () => {
  it('matches last snapshot', () => {
    const event = {
      startTime: moment(1551908483315),
      endTime: moment(1551919283315),
      location: 'Oakland'
    }

    const props = {
      event,
      slug: 'sluggo',
      expanded: true,
      className: 'external-class',
      respondToEvent: () => {}
    }
    const wrapper = shallow(<EventBody {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
