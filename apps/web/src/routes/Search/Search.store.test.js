import { presentSearchResult } from './Search.store'
import orm from 'store/models'

describe('presentSearchResult', () => {
  const session = orm.session(orm.getEmptyState())
  const commentId = 21
  const creator = session.Person.create({
    name: 'Ron'
  })
  session.Post.create({
    id: 'commentpost'
  })
  session.Comment.create({
    id: commentId,
    creator: creator.id,
    post: 'commentpost'
  })
  session.Attachment.create({
    url: 'foo.png',
    comment: commentId
  })
  const searchResult = session.SearchResult.create({
    content: `Comment-${commentId}`
  })

  it('presents a Comment SearchResult', () => {
    expect(presentSearchResult(searchResult, session))
      .toMatchSnapshot()
  })
})
