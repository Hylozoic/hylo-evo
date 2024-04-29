import React from 'react'
import CardImageAttachments from './CardImageAttachments'
import { shallow } from 'enzyme'

it('renders no images', () => {
  expect(shallow(<CardImageAttachments attachments={[
    { url: 'bonkerz', type: 'file' },
    { url: 'bonkers', type: 'file' },
    { url: 'bonkerzztop', type: 'file' }
  ]} />)).toEqual({})
})

it('renders a single image', () => {
  expect(shallow(<CardImageAttachments attachments={[
    { url: 'foo', type: 'image' },
    { url: 'bonkerz', type: 'file' }
  ]} />)).toMatchSnapshot()
})

it('renders multiple images', () => {
  expect(shallow(<CardImageAttachments attachments={[
    { url: 'bar', type: 'image' },
    { url: 'baz', type: 'image' },
    { url: 'bonk', type: 'image' },
    { url: 'bonkerz', type: 'file' }
  ]} />)).toMatchSnapshot()
})
