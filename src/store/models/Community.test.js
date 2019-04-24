import orm from 'store/models' // this initializes redux-orm

it('can be created', () => {
  const community = { id: '1' }
  const session = orm.session(orm.getEmptyState())
  session.Community.create(community)

  const { Community: { items, itemsById } } = session.state
  expect(items).toEqual([community.id])
  expect(itemsById[community.id]).toEqual(community)
})

it('can have moderators added', () => {
  const community = { id: '1' }
  const session = orm.session(orm.getEmptyState())
  session.Community.create(community)

  const moderators = [{ id: 1, name: 'Joe' }, { id: 2, name: 'Sue' }].map(p =>
    session.Person.create(p))

  session.Community.withId('1').update({ moderators })

  const retrievedMods = session.Community.withId('1').moderators.toModelArray()

  expect(retrievedMods).toHaveLength(2)
  expect(retrievedMods[0].name).toEqual('Joe')
})
