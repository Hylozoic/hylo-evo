import React from 'react'
import { MemoryRouter } from 'react-router'
import { mount } from 'enzyme'
import GroupsWidget from './GroupsWidget'

const defaultMinProps = {
  routeParams: { context: 'groups', slug: 'group one'},
  items: []
}

function renderComponent (renderFunc, props = {}) {
  return renderFunc(
   <MemoryRouter initialEntries={['/']} keyLength={0}><GroupsWidget {...{ ...defaultMinProps, ...props }} /></MemoryRouter>
  )
}

describe('GroupsWidget', () => {
  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(mount)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with items', () => {
    const props = {
      items: [
        { id: 1, slug: 'slug2', name: 'group one', avatarUrl: 'https://google.com', description: 'yo', memberCount: 1 },
        { id: 2, slug: 'slug2', name: 'group 2', avatarUrl: 'https://google.com', description: 'oy', memberCount: 10 }
      ]
    }
    const wrapper = renderComponent(mount, props)
    expect(wrapper).toMatchSnapshot()
  })

})
