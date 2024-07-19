import { shallow } from 'enzyme'
import React from 'react'

import MemberVotes from './MemberVotes'
import denormalized from '../MemberProfile.test.json'

describe.only('MemberVotes', () => { // TODO REACTIONS: switch this to reactions
  const { person } = denormalized.data

  it('renders the same as the last snapshot', () => {
    const wrapper = shallow(
      <MemberVotes fetchMemberVotes={jest.fn()} posts={person.votes} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
