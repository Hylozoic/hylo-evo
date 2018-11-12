import { presentSearchResult } from './Search.store'
import { mergeProps } from './Search.connector'
import orm from 'store/models'

describe('presentSearchResult', () => {
  const session = orm.session(orm.getEmptyState())
  const commentId = 21
  const creator = session.Person.create({
    name: 'Ron'
  })
  session.Comment.create({
    id: commentId,
    creator: creator.id
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
