import configureStore from 'redux-mock-store'
import { shallow } from 'enzyme'
import React from 'react'

import orm from 'store/models'
import PersonProfile from './PersonProfile'
import { getPerson } from './PersonProfile.connector'
import payload from './PersonProfile.test.json'

it('Sets the username correctly', () => {
  const { person } = payload.data
  const wrapper = shallow(<PersonProfile id={person.id} person={person} />)
  expect(wrapper.find('h1').text()).toBe(person.name)
})

describe.only('getPerson', () => {
  let store = null
  let session = null
  const mockStore = configureStore([])

  beforeEach(() => {
    store = mockStore({
      ...orm.getEmptyState(),
      Person: {
        items: [ '1001' ],
        itemsById: { '1001': { id: '1001', name: 'Wombat', avatarUrl: 'foo', bannerUrl: 'bar' } },
        meta: { maxId: 1001 }
      }
    })
    session = orm.mutableSession(store.getState())
  })

  it('Does find an entity that was created', () => {
    session.Person.create({
      id: '1',
      name: 'Wombat'
    })
    const actual = getPerson('1')(store.getState())
    expect(actual).toBeTruthy()
  })

  it('Returns null for a non-existent entity', () => {
    const actual = getPerson('1')(store.getState())
    expect(actual).toBe(null)
  })
})
