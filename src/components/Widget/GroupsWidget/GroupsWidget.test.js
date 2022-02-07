import React from 'react'
import { shallow } from 'enzyme'
import GroupsWidget from './GroupsWidget'

const defaultMinProps = {
  routeParams: { context: 'groups', slug: 'group one'},
  items: []
}

function renderComponent (renderFunc, props = {}) {
  return renderFunc(
    <GroupsWidget {...{ ...defaultMinProps, ...props }} />
  )
}

describe('GroupsWidget', () => {
  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with items', () => {
    const props = {
      items: [
        { id: 1, slug: 'slug2', name: 'group one', avatarUrl: 'https://google.com', description: 'yo', memberCount: 1 },
        { id: 2, slug: 'slug2', name: 'group 2', avatarUrl: 'https://google.com', description: 'oy', memberCount: 10 }
      ]
    }
    const wrapper = renderComponent(shallow, props)
    expect(wrapper).toMatchSnapshot()
  })

})
