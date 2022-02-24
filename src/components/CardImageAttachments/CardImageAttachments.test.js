import React from 'react'
import CardImageAttachments from './CardImageAttachments'
import { shallow } from 'enzyme'

it('renders a single image', () => {
  expect(shallow(<CardImageAttachments attachments={[
    { url: 'foo', type: 'image' }
  ]} />)).toMatchSnapshot()
})

it('renders multiple images', () => {
  expect(shallow(<CardImageAttachments attachments={[
    { url: 'bar', type: 'image' },
    { url: 'baz', type: 'image' },
    { url: 'bonk', type: 'image' }
  ]} />)).toMatchSnapshot()
})
