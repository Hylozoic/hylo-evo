import React from 'react'
import PostPrompt from './StreamBanner'
import { mount } from 'enzyme'

it('renders with a post prompt', () => {
  const node = mount(<PostPrompt
    firstName='Arturo'
  />)
  expect(node).toMatchSnapshot()
})
