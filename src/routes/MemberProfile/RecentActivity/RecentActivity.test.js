import { shallow } from 'enzyme'
import React from 'react'

import RecentActivity from './RecentActivity'
import denormalized from '../MemberProfile.test.json'

describe.only('RecentActivity', () => {
  const { person } = denormalized.data

  it('renders the same as the last snapshot', () => {
    const wrapper = shallow(
      <RecentActivity fetchRecentActivity={jest.fn()} routeParams={{}} activityItems={person.comments.concat(person.posts)} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
