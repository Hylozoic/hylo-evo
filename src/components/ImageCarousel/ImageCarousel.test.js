import React from 'react'
import ImageCarousel from './ImageCarousel'
import { shallow } from 'enzyme'

it('renders a single image', () => {
  expect(shallow(<ImageCarousel attachments={[
    { url: 'foo', type: 'image' },
    { url: 'bonkerz', type: 'file' }
  ]} />)).toMatchSnapshot()
})

it('renders multiple images', () => {
  expect(shallow(<ImageCarousel attachments={[
    { url: 'bar', type: 'image' },
    { url: 'baz', type: 'image' },
    { url: 'bonk', type: 'image' },
    { url: 'bonkerz', type: 'file' }
  ]} />)).toMatchSnapshot()
})
