import React from 'react'
import PostImageAttachments from './PostImageAttachments'
import { shallow } from 'enzyme'

it('renders a single image', () => {
  expect(shallow(<PostImageAttachments attachments={[
    { url: 'foo', type: 'image' }
  ]} />)).toMatchSnapshot()
})

it('renders multiple images', () => {
  expect(shallow(<PostImageAttachments attachments={[
    { url: 'bar', type: 'image' },
    { url: 'baz', type: 'image' },
    { url: 'bonk', type: 'image' },
    { url: 'bonk', type: 'file' }
  ]} />)).toMatchSnapshot()
})
