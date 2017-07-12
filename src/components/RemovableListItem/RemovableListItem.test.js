import RemovableListItem from './RemovableListItem'
import { shallow } from 'enzyme'
import React from 'react'

describe('RemovableListItem', () => {
  it('renders correctly', () => {
    const item = {
      id: 7,
      name: 'Zeus',
      avatarUrl: 'zeus.png'
    }
    const wrapper = shallow(<RemovableListItem item={item} slug='foo' removeModerator={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
