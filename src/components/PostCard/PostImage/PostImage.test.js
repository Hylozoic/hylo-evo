import React from 'react'
import PostImage from './PostImage'
import { shallow } from 'enzyme'

it('renders a single image', () => {
  expect(shallow(<PostImage firstImageUrl='foo' />)).toMatchSnapshot()
})

it('renders multiple images', () => {
  expect(shallow(<PostImage firstImageUrl='foo' otherImageUrls={[
    'bar', 'baz', 'bonk'
  ]} />)).toMatchSnapshot()
})
