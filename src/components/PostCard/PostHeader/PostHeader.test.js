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

  const groups = [
    {
      name: 'FooC', slug: 'fooc'
    },
    {
      name: 'BarC', slug: 'barc'
    }
  ]

  const wrapper = shallow(<PostHeader groups={groups} creator={creator} />)
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({ context, type: 'request', groups })
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({ deletePost: () => {}, editPost: () => {} })
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

  const groups = [
    {
      name: 'FooC', slug: 'fooc'
    },
    {
      name: 'BarC', slug: 'barc'
    }
  ]

  const wrapper = shallow(<PostHeader groups={groups} creator={creator} announcement />)
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({ context, type: 'request', groups })
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({ deletePost: () => {}, editPost: () => {} })
  expect(wrapper).toMatchSnapshot()
})

describe('TopicsLine', () => {
  it('matches last snapshot', () => {
    const props = {
      topics: [{ name: 'one' }, { name: 'two' }],
      slug: 'hay',
      newLine: true
    }

    const wrapper = shallow(<TopicsLine {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
