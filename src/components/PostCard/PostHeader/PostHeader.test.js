import PostHeader, { TopicsLine } from './PostHeader'
import { DateTime, Settings } from 'luxon'
import { shallow } from 'enzyme'
import React from 'react'

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
beforeAll(() => { // So that local will not be used in tests
  Settings.defaultZoneName = 'utc'
})

let expectedNow = DateTime.local(2022, 6, 1, 23, 0, 0, { locale: 'en', zone: 'utc' }).toMillis()
let startTime = '2020-11-29T00:00:00.000Z'
let endTime = '2099-11-29T00:00:00.000Z'
let fulfilledAt = '2100-11-29T00:00:00.000Z'

it('matches snapshot', () => {
  Settings.now = () => expectedNow
  const wrapper = shallow(<PostHeader groups={groups} creator={creator} fulfilledAt={fulfilledAt} startTime={startTime} endTime={endTime} />)
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({ context, type: 'request', groups })
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({ deletePost: () => {}, editPost: () => {} })
  expect(wrapper).toMatchSnapshot()
})

it('matches announcement snapshot', () => {
  Settings.now = () => expectedNow
  const wrapper = shallow(<PostHeader groups={groups} creator={creator} fulfilledAt={fulfilledAt} announcement startTime={startTime} endTime={endTime} />)
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({ context, type: 'request', groups })
  expect(wrapper).toMatchSnapshot()
  wrapper.setProps({ deletePost: () => {}, editPost: () => {} })
  expect(wrapper).toMatchSnapshot()
})

it('displays fulfilledAt time if it is before endTime', () => {
  Settings.now = () => expectedNow
  fulfilledAt = '2095-11-29T00:00:00.000Z'

  const wrapper = shallow(<PostHeader groups={groups} creator={creator} fulfilledAt={fulfilledAt} startTime={startTime} endTime={endTime} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders human readable dates', () => {
  Settings.now = () => expectedNow
  const wrapper = shallow(<PostHeader type='request' groups={groups} creator={creator} fulfilledAt={fulfilledAt} context={context} startTime={startTime} endTime={endTime} />)
  expect(wrapper).toMatchSnapshot()
  startTime = '2022-11-29T00:00:00.000Z'
  endTime = '2099-11-29T00:00:00.000Z'
  expectedNow = DateTime.local(2023, 1, 1, 23, 0, 0, { locale: 'en', zone: 'utc' })
  Settings.now = () => expectedNow
  wrapper.setProps({ startTime, endTime })
  expect(wrapper).toMatchSnapshot()
  startTime = '2010-11-29T00:00:00.000Z'
  endTime = '2020-11-29T00:00:00.000Z'
  expectedNow = DateTime.local(2022, 6, 1, 23, 0, 0, { locale: 'en', zone: 'utc' })
  Settings.now = () => expectedNow
  wrapper.setProps({ startTime, endTime })
  expect(wrapper).toMatchSnapshot()
})

describe('TopicsLine', () => {
  Settings.now = () => expectedNow
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
