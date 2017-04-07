import { shallow } from 'enzyme'
import React from 'react'

import orm from 'store/models'
import PersonProfile from './PersonProfile'
import { getPerson } from './PersonProfile.connector'
import payload from './PersonProfile.normalized.test.json'
import denormalized from './PersonProfile.test.json'

it('Sets the username correctly', () => {
  const person = { ...payload.person, posts: [] }
  const wrapper = shallow(<PersonProfile id={person.id} person={person} />)
  expect(wrapper.find('h1').text()).toBe(person.name)
})

describe('getPerson', () => {
  let session = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    const { person, posts, communities } = payload
    session.Person.create(person)
    session.Community.create(communities[0])
    session.Post.create(posts[0])
  })

  it('Returns null for a non-existent entity', () => {
    const actual = getPerson('1')(session.state)
    expect(actual).toBe(null)
  })

  it('Populates relations correctly', () => {
    const { person } = denormalized.data
    const expected = {
      ...person,
      posts: person.posts.map(post => ({ ...post, creator: post.creator.id }))
    }
    const actual = getPerson(payload.person.id)(session.state)
    expect(actual).toEqual(expected)
  })
})
