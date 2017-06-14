import orm from 'store/models' // this initializes redux-orm

describe('getContent', () => {
  it('fetches the correct model based on polymorphicId', () => {
    const session = orm.session(orm.getEmptyState())
    const id = '2'
    const title = 'Hey'

    session.Post.create({
      id, title
    })

    session.Post.create({
      id: '1', title: 'hi'
    })

    session.Comment.create({
      id, text: 'hello'
    })

    session.SearchResult.create({
      id: '3',
      content: `Post-${id}`
    })

    const content = session.SearchResult.withId('3').getContent(session)

    expect(content.id).toEqual(id)
    expect(content.title).toEqual(title)
  })
})
