import React from 'react'
import { shallow } from 'enzyme'
import Drawer, { CommunityRow } from './Drawer'

const communities = [
  {
    id: '11', slug: 'foo', name: 'Foomunity', avatarUrl: '/foo.png', newPostCount: 0
  },
  {
    id: '22', slug: 'bar', name: 'Barmunity', avatarUrl: '/bar.png', newPostCount: 7
  }
]

const networks = [
  {
    id: '1',
    name: 'Wombat Network',
    avatarUrl: '/wombat.png',
    communities
  }
]

describe('Drawer', () => {
  it('renders with a current community', () => {
    const wrapper = shallow(<Drawer
      currentCommunityOrNetwork={communities[0]}
      communities={communities}
      networks={[]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders without a current community', () => {
    const wrapper = shallow(<Drawer communities={communities} networks={[]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a community list if networks are present', () => {
    const wrapper = shallow(<Drawer communities={communities} networks={networks} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('CommunityRow', () => {
  it('renders with zero new posts', () => {
    const wrapper = shallow(<CommunityRow community={communities[0]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders with new posts', () => {
    const wrapper = shallow(<CommunityRow community={communities[0]} />)
    expect(wrapper).toMatchSnapshot()
  })
})
