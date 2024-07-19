import React from 'react'
import { shallow } from 'enzyme'
import PostCard from './PostCard'
import { fakePost } from 'util/testing/testData'
import faker from '@faker-js/faker'
import timezoneMock from 'timezone-mock'

faker.seed(9000)

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

beforeEach(() => {
  timezoneMock.register('US/Pacific')
})

afterEach(() => {
  timezoneMock.unregister()
})

it('renders as expected', () => {
  const post = {
    ...fakePost(),
    updatedAt: new Date('2014-01-17').toISOString()
  }
  const wrapper = shallow(<PostCard post={post} routeParams={{ slug: 'foom' }} />)
  expect(wrapper).toMatchSnapshot()
})
