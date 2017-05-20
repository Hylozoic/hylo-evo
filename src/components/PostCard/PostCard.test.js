import React from 'react'
import { shallow } from 'enzyme'
import PostCard from './PostCard'
import samplePost from './samplePost'
import faker from 'faker'

faker.seed(9000)

it('renders as expected', () => {
  const post = {
    ...samplePost(),
    updatedAt: new Date('2014-01-17').toString()
  }
  const wrapper = shallow(<PostCard post={post} />)
  expect(wrapper).toMatchSnapshot()

  const header = wrapper.find('PostHeader').dive()

  // we have to avoid storing a relative timestamp label in the snapshot, since
  // it would become incorrect as soon as some time passed
  expect(header.debug().replace(/^.*ago/m, '')).toMatchSnapshot()
})
