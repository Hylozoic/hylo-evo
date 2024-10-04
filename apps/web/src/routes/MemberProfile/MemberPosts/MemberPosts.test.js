import { shallow } from 'enzyme'
import React from 'react'

import MemberPosts from './MemberPosts'
import denormalized from '../MemberProfile.test.json'

describe.only('MemberPosts', () => {
  const { person } = denormalized.data

  it('renders the same as the last snapshot', () => {
    const wrapper = shallow(
      <MemberPosts fetchMemberPosts={jest.fn()} posts={person.posts} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
