import { ORM, Model, attr, many } from 'redux-orm'
import './Model.extension'
import { times } from 'lodash'

const Limb = Model.createClass({})
Limb.modelName = 'Limb'
Limb.fields = {
  id: attr()
}

const Dog = Model.createClass({})
Dog.modelName = 'Dog'
Dog.fields = {
  id: attr(),
  legs: many('Limb')
}

it('adds a function', () => {
  expect(typeof new Dog({}).updateAppending).toEqual('function')
})

describe('updateAppending', () => {
  var orm, session

  beforeAll(() => {
    orm = new ORM()
    orm.register(Dog, Limb)
  })

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
    session.Dog.create({id: 1, legs: [1, 2]})
    times(4, i => session.Limb.create({id: i + 1}))
  })

  it('appends ids for many-to-many relations', () => {
    session.Dog.withId(1).updateAppending({legs: [3, 4]})
    expect(session.Dog.withId(1).legs.toRefArray().map(x => x.id))
    .toEqual([1, 2, 3, 4])
  })

  it('removes duplicate ids', () => {
    session.Dog.withId(1).updateAppending({legs: [2, 3, 4]})
    expect(session.Dog.withId(1).legs.toRefArray().map(x => x.id))
    .toEqual([1, 2, 3, 4])
  })
})
