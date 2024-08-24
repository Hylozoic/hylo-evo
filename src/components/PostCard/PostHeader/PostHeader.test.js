import PostHeader, { TopicsLine } from './PostHeader'
import { shallow } from 'enzyme'
import React from 'react'
import { RESP_ADMINISTRATION } from 'store/constants'
import { render } from 'util/testing/reactTestingLibraryExtended'
import '@testing-library/jest-dom'

Date.now = jest.fn(() => new Date(2024, 6, 23, 16, 30))

it('matches snapshot', () => {
  const creator = {
    name: 'JJ',
    avatarUrl: 'foo.png',
    id: 123,
    moderatedGroupMemberships: []
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

  const wrapper = shallow(<PostHeader groups={groups} creator={creator} roles={[{ id: 1, title: 'Coordinator', common: true, responsibilities: [RESP_ADMINISTRATION] }]} />)
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({ context, type: 'request', groups })
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({ deletePost: () => {}, editPost: () => {}, duplicatePost: () => {} })
  expect(wrapper).toMatchSnapshot()
})

it('matches announcement snapshot', () => {
  const creator = {
    name: 'JJ',
    avatarUrl: 'foo.png',
    id: 123,
    moderatedGroupMemberships: []
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

  const wrapper = shallow(<PostHeader groups={groups} creator={creator} announcement roles={[]} />)
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({ context, type: 'request', groups })
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({ deletePost: () => {}, editPost: () => {}, duplicatePost: () => {} })
  expect(wrapper).toMatchSnapshot()
})

it('renders human readable dates', () => {
  const creator = {
    name: 'JJ',
    avatarUrl: 'foo.png',
    id: 123,
    moderatedGroupMemberships: []
  }
  const groups = [
    {
      name: 'FooC', slug: 'fooc'
    },
    {
      name: 'BarC', slug: 'barc'
    }
  ]
  const context = {
    label: 'some context',
    url: '/foo/bar'
  }
  let startTime = '2020-11-29'
  let endTime = '2029-11-29'

  const wrapper = shallow(<PostHeader type='request' groups={groups} creator={creator} context={context} startTime={startTime} endTime={endTime} roles={[]} />)
  expect(wrapper).toMatchSnapshot()
  startTime = '2022-11-29'
  endTime = '2029-11-29'
  wrapper.setProps({ startTime, endTime })
  expect(wrapper).toMatchSnapshot()
  startTime = '2010-11-29'
  endTime = '2020-11-29'
  wrapper.setProps({ startTime, endTime })
  expect(wrapper).toMatchSnapshot()
})

it('renders created at timestamp', () => {
  const creator = {
    name: 'JJ',
    avatarUrl: 'foo.png',
    id: 123,
    moderatedGroupMemberships: []
  }

  const createdTimestamp = 'Posted 1w ago'
  const editedTimestamp = null
  const { getByText } = render(<PostHeader creator={creator} roles={[]} editedTimestamp={editedTimestamp} createdTimestamp={createdTimestamp} />)
  expect(getByText(createdTimestamp)).toBeInTheDocument()
})

it('renders edited at timestamp', () => {
  const creator = {
    name: 'JJ',
    avatarUrl: 'foo.png',
    id: 123,
    moderatedGroupMemberships: []
  }

  const createdTimestamp = 'Posted 1w ago'
  const editedTimestamp = 'Edited 12m ago'
  const { getByText } = render(<PostHeader creator={creator} roles={[]} editedTimestamp={editedTimestamp} createdTimestamp={createdTimestamp} />)
  expect(getByText(editedTimestamp)).toBeInTheDocument()
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
