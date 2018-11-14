import React from 'react'
import { shallow } from 'enzyme'
import PostCard from './PostCard'
import samplePost from './samplePost'
import faker from 'faker'
import timezoneMock from 'timezone-mock'

faker.seed(9000)

beforeEach(() => {
  timezoneMock.register('US/Pacific')
})

afterEach(() => {
  timezoneMock.unregister()
})

it('renders as expected', () => {
  const post = {
    ...samplePost(),
    updatedAt: new Date('2014-01-17').toISOString()
  }
  const wrapper = shallow(<PostCard post={post} voteOnPost={() => {}} slug='foom' />)
  expect(wrapper).toMatchSnapshot()
})
