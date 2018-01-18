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
    const wrapper = shallow(<RemovableListItem item={item} url={'/happy/place'} removeItem={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('does not render as links when no URL specified', () => {
    const item = {
      id: 7,
      name: 'Zeus',
      avatarUrl: 'zeus.png'
    }
    const wrapper = shallow(<RemovableListItem item={item} removeItem={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('doesnt render a remove link', () => {
    const item = {
      id: 7,
      name: 'Zeus',
      avatarUrl: 'zeus.png'
    }
    const wrapper = shallow(<RemovableListItem item={item} url={'/happy/place'} />)
    expect(wrapper).toMatchSnapshot()
  })
})
