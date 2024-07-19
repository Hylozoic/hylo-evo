import { shallow } from 'enzyme'
import React from 'react'

import MemberComments from './MemberComments'
import denormalized from '../MemberProfile.test.json'

describe.only('MemberComments', () => {
  const { person } = denormalized.data

  it('renders the same as the last snapshot', () => {
    const wrapper = shallow(
      <MemberComments fetchMemberComments={jest.fn()} comments={person.comments} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
