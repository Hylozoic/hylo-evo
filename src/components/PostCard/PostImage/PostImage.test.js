import React from 'react'
import PostImage from './PostImage'
import { shallow } from 'enzyme'

it('renders a single image', () => {
  expect(shallow(<PostImage imageUrl='foo' />)).toMatchSnapshot()
})

it('renders multiple images', () => {
  expect(shallow(<PostImage imageUrl='foo' otherImageUrls={[
    'bar', 'baz', 'bonk'
  ]} />)).toMatchSnapshot()
})
