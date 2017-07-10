import ModeratorControl from './ModeratorControl'
import { shallow } from 'enzyme'
import React from 'react'

describe('ModeratorControl', () => {
  it('renders correctly', () => {
    const moderator = {
      id: 7,
      name: 'Zeus',
      avatarUrl: 'zeus.png'
    }
    const wrapper = shallow(<ModeratorControl moderator={moderator} slug='foo' />)
    expect(wrapper).toMatchSnapshot()
  })
})
