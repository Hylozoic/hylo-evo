import React from 'react'
import CardImage from './CardImage'
import { shallow } from 'enzyme'

it('renders a single image', () => {
  expect(shallow(<CardImage firstImageUrl='foo' />)).toMatchSnapshot()
})

it('renders multiple images', () => {
  expect(shallow(<CardImage firstImageUrl='foo' otherImageUrls={[
    'bar', 'baz', 'bonk'
  ]} />)).toMatchSnapshot()
})
