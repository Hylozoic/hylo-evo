import orm from 'store/models' // this initializes redux-orm

it('can be created', () => {
  const group = { id: '1' }
  const session = orm.session(orm.getEmptyState())
  session.Group.create(group)

  const { Group: { items, itemsById } } = session.state
  expect(items).toEqual([group.id])
  expect(itemsById[group.id]).toEqual(group)
})

it('can have moderators added', () => {
  const group = { id: '1' }
  const session = orm.session(orm.getEmptyState())
  session.Group.create(group)

  const moderators = [{ id: 1, name: 'Joe' }, { id: 2, name: 'Sue' }].map(p =>
    session.Person.create(p))

  session.Group.withId('1').update({ moderators })

  const retrievedMods = session.Group.withId('1').moderators.toModelArray()

  expect(retrievedMods).toHaveLength(2)
  expect(retrievedMods[0].name).toEqual('Joe')
})
