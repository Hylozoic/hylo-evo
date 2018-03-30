import PostHeader, { TopicsLine } from './PostHeader'
import { shallow } from 'enzyme'
import React from 'react'

it('matches snapshot', () => {
  const creator = {
    name: 'JJ',
    avatarUrl: 'foo.png',
    id: 123
  }
  const context = {
    label: 'some context',
    url: '/foo/bar'
  }

  const communities = [
    {
      name: 'FooC', slug: 'fooc'
    },
    {
      name: 'BarC', slug: 'barc'
    }
  ]

  const wrapper = shallow(<PostHeader communities={communities} creator={creator} />)
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({context, type: 'request', communities, showCommunity: true})
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({deletePost: () => {}, editPost: () => {}})
  expect(wrapper).toMatchSnapshot()
})

it('matches announcement snapshot', () => {
  const creator = {
    name: 'JJ',
    avatarUrl: 'foo.png',
    id: 123
  }
  const context = {
    label: 'some context',
    url: '/foo/bar'
  }

  const communities = [
    {
      name: 'FooC', slug: 'fooc'
    },
    {
      name: 'BarC', slug: 'barc'
    }
  ]

  const wrapper = shallow(<PostHeader communities={communities} creator={creator} announcement />)
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({context, type: 'request', communities, showCommunity: true})
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({deletePost: () => {}, editPost: () => {}})
  expect(wrapper).toMatchSnapshot()
})

describe('TopicsLine', () => {
  it('matches last snapshot', () => {
    const props = {
      topics: [{name: 'one'}, {name: 'two'}],
      slug: 'hay',
      newLine: true
    }

    const wrapper = shallow(<TopicsLine {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
