import React from 'react'
import { shallow } from 'enzyme'
import EventBody from './EventBody'
import { DateTime } from 'luxon'

describe('EventBody', () => {
  it.skip('matches last snapshot', () => {
    const event = {
      startTime: DateTime.fromISO('2023-01-24T03:14:59.949Z'),
      endTime: DateTime.fromISO('2083-01-24T03:14:59.949Z'),
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
