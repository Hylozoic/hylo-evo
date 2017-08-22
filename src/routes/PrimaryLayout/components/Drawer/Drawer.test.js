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

const networks = [
  {
    id: '1',
    name: 'Wombat Network',
    avatarUrl: '/wombat.png',
    memberships
  }
]

describe('Drawer', () => {
  it('renders with a current community', () => {
    const wrapper = shallow(<Drawer
      currentCommunity={memberships[0].community}
      memberships={memberships}
      networks={[]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders without a current community', () => {
    const wrapper = shallow(<Drawer memberships={memberships} networks={[]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a community list if networks are present', () => {
    const wrapper = shallow(<Drawer memberships={memberships} networks={networks} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('CommunityRow', () => {
  it('renders with zero new posts', () => {
    const { community, newPostCount } = memberships[0]
    const wrapper = shallow(<CommunityRow community={community} newPostCount={newPostCount} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders with new posts', () => {
    const { community, newPostCount } = memberships[1]
    const wrapper = shallow(<CommunityRow community={community} newPostCount={newPostCount} />)
    expect(wrapper).toMatchSnapshot()
  })
})
