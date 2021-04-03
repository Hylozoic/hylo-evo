import React from 'react'
import { shallow } from 'enzyme'
import Drawer, { ContextRow } from './Drawer'

const groups = [
  {
    id: '11', slug: 'foo', name: 'Foomunity', avatarUrl: '/foo.png', newPostCount: 0
  },
  {
    id: '22', slug: 'bar', name: 'Barmunity', avatarUrl: '/bar.png', newPostCount: 7
  }
]

const match = {
  match: {
    params: {
      context: 'groups',
      groupSlug: 'slug'
    }
  }
}

describe('Drawer', () => {
  it('renders with a current group', () => {
    const wrapper = shallow(<Drawer
      match={match}
      group={groups[0]}
      groups={groups}
      defaultContexts={[]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders without a current group', () => {
    const wrapper = shallow(<Drawer groups={groups} defaultContexts={[]} match={match}/>)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('ContextRow', () => {
  it('renders with zero new posts', () => {
    const wrapper = shallow(<ContextRow group={groups[0]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders with new posts', () => {
    const wrapper = shallow(<ContextRow group={groups[0]} />)
    expect(wrapper).toMatchSnapshot()
  })
})

