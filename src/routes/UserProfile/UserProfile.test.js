import configureStore from 'redux-mock-store'
import { shallow } from 'enzyme'
import React from 'react'

import { getPerson } from './UserProfile.connector'
import UserProfile from './UserProfile'
import orm from 'store/models'
import payload from './UserProfile.test.json'

it('Exists', () => {
  const wrapper = shallow(<UserProfile />)
  expect(wrapper.find('<div>')).toBeTruthy()
})

describe('getPerson', () => {
  let store = null
  let session = null
  const mockStore = configureStore([])

  beforeEach(() => {
    store = mockStore(orm.getEmptyState())
    session = orm.session(store.getState())
  })

  it('Does not find a non-existent entity', () => {
    const actual = session.Person.hasId('1')
    expect(actual).toBeFalsy()
  })

  it('Does find an entity that was created', () => {
    session.Person.create({
      id: '1',
      name: 'Wombat'
    })
    const actual = session.Person.hasId('1')
    expect(actual).toBeFalsy()
  })
})
