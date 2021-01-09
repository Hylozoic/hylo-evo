import { ORM, Model, attr, many } from 'redux-orm'
import './Model.extension'
import { times } from 'lodash'

class Limb extends Model {}
Limb.modelName = 'Limb'
Limb.fields = {
  id: attr()
}

class Dog extends Model {}
Dog.modelName = 'Dog'
Dog.fields = {
  id: attr(),
  legs: many('Limb')
}
let orm

beforeAll(() => {
  orm = new ORM()
  orm.register(Dog, Limb)
})

describe('safeGet', () => {
  let session

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
    session.Dog.create({ id: 1, legs: [1, 2], name: 'Sender' })
    session.Dog.create({ id: 2, legs: [1, 2], name: 'Fury' })
    session.Dog.create({ id: 3, legs: [1, 2], name: 'Milo' })
    times(4, i => session.Limb.create({ id: i + 1 }))
  })

  it('works', () => {
    expect(session.Dog.safeGet({})).toBe(null)
    expect(session.Dog.safeGet()).toBe(null)
    expect(session.Dog.safeGet({ id: null })).toBe(null)
    expect(session.Dog.safeGet({ id: 5 })).toBe(null)
    expect(session.Dog.safeGet({ id: 2 })).toEqual(session.Dog.withId(2))
    expect(session.Dog.safeGet({ id: null, name: 'Fury' })).toEqual(session.Dog.withId(2))
  })
})

it('adds a function', () => {
  expect(typeof new Dog({}).updateAppending).toEqual('function')
})

describe('updateAppending', () => {
  let session

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
    session.Dog.create({ id: 1, legs: [1, 2] })
    times(4, i => session.Limb.create({ id: i + 1 }))
  })

  it('appends ids for many-to-many relations', () => {
    session.Dog.withId(1).updateAppending({ legs: [3, 4] })
    expect(session.Dog.withId(1).legs.toRefArray().map(x => x.id))
      .toEqual([1, 2, 3, 4])
  })

  it('removes duplicate ids', () => {
    session.Dog.withId(1).updateAppending({ legs: [2, 3, 4] })
    expect(session.Dog.withId(1).legs.toRefArray().map(x => x.id))
      .toEqual([1, 2, 3, 4])
  })
})
