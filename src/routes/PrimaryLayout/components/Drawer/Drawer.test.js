import React from 'react'
import { shallow } from 'enzyme'
import Drawer, { CommunityRow } from './Drawer'

const memberships = [
  {
    id: '1',
    newPostCount: 0,
    community: {id: '11', slug: 'foo', name: 'Foomunity', avatarUrl: '/foo.png'}
  },
  {
    id: '2',
    newPostCount: 7,
    community: {id: '22', slug: 'bar', name: 'Barmunity', avatarUrl: '/bar.png'}
  }
]

describe('Drawer', () => {
  it('renders with a current community', () => {
    const wrapper = shallow(<Drawer currentCommunity={memberships[0].community}
      communities={memberships} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders without a current community', () => {
    const wrapper = shallow(<Drawer communities={memberships} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('CommunityRow', () => {
  it('renders with zero new posts', () => {
    const wrapper = shallow(<CommunityRow membership={memberships[0]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders with new posts', () => {
    const wrapper = shallow(<CommunityRow membership={memberships[1]} />)
    expect(wrapper).toMatchSnapshot()
  })
})
