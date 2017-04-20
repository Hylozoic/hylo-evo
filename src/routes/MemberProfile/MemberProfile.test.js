import { shallow } from 'enzyme'
import React from 'react'

import MemberProfile from './MemberProfile'
import denormalized from './MemberProfile.test.json'

describe.only('MemberProfile', () => {
  const { person } = denormalized.data

  it('renders the same as the last snapshot', () => {
    const match = { params: { id: '1' } }
    const wrapper = shallow(
      <MemberProfile match={match} person={person} ready={true} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('displays an error if one is present', () => {
    const props = {
      error: 'WOMBAT-TYPE INVALID',
      person
    }
    const wrapper = shallow(<MemberProfile { ...props } />)
    expect(wrapper.contains(props.error)).toBe(true)
  })
})
