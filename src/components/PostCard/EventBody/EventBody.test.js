import React from 'react'
import { shallow } from 'enzyme'
import EventBody, { formatDates } from './EventBody'
import moment from 'moment'

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

describe('formatDates', () => {
  it('displays differences of dates', () => {
    const d1 = moment(1551908483315).month(1).day(1).hour(18)
    const d2 = moment(d1).hour(21)
    const d3 = moment(d2).day(2)
    const d4 = moment(d3).month(2)

    expect(formatDates(d1)).toMatchSnapshot()
    expect(formatDates(d1, d2)).toMatchSnapshot()
    expect(formatDates(d1, d3)).toMatchSnapshot()
    expect(formatDates(d1, d4)).toMatchSnapshot()
  })
})
