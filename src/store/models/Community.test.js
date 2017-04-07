import orm from 'store/models' // this initializes redux-orm

it('can be created', () => {
  const community = {id: '1'}
  const session = orm.session(orm.getEmptyState())
  session.Community.create(community)

  const { Community: { items, itemsById } } = session.state
  expect(items).toEqual([community.id])
  expect(itemsById[community.id]).toEqual(community)
})
