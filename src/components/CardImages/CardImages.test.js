import React from 'react'
import CardImages from './CardImages'
import { shallow } from 'enzyme'

it('renders a single image', () => {
  expect(shallow(<CardImages attachments={[
    { url: 'foo', type: 'image' }
   ]} />)).toMatchSnapshot()
})

it('renders multiple images', () => {
  expect(shallow(<CardImages attachments={[
    { url: 'bar', type: 'image' },
    { url: 'baz', type: 'image' },
    { url: 'bonk', type: 'image' }
  ]} />)).toMatchSnapshot()
})
