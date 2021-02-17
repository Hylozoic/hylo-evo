import { getComments } from './getComments'
import orm from 'store/models'
import extractModelsFromAction from 'store/reducers/ModelExtractor/extractModelsFromAction'

describe('getComments', () => {
  it("returns an empty array if post doesn't exist", () => {
    const session = orm.session(orm.getEmptyState())
    expect(getComments(session.state, { postId: '1' })).toEqual([])
  })

  it('returns images', () => {
    const session = orm.session(orm.getEmptyState())
    const setupActions = [
      {
        payload: {
          data: {
            post: {
              id: 1,
              comments: {
                items: [
                  {
                    id: 11,
                    text: 'eleven',
                    parentComment: null,
                    attachments: [
                      {
                        id: 111,
                        url: 'foo.png'
                      }
                    ]
                  },
                  {
                    id: 12,
                    text: 'twelve',
                    parentComment: null,
                    attachments: [
                      {
                        id: 121,
                        url: 'bar.png'
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        meta: { extractModel: 'Post' }
      },
      {
        payload: {
          data: {
            post: {
              id: 2,
              comments: {
                items: [
                  {
                    id: 21,
                    parentComment: null,
                    text: 'twentyone',
                    attachments: [
                      {
                        id: 211,
                        url: 'foo2.png'
                      }
                    ]
                  },
                  {
                    id: 22,
                    text: 'twentytwo',
                    parentComment: null,
                    attachments: [
                      {
                        id: 221,
                        url: 'bar2.png'
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        meta: { extractModel: 'Post' }
      }
    ]

    extractModelsFromAction(setupActions[0], session)
    extractModelsFromAction(setupActions[1], session)

    const state = {
      orm: session.state
    }

    const comments = getComments(state, { postId: 1 })
    expect(comments.length).toEqual(2)
    expect(comments.map(c => c.text)).toEqual(['eleven', 'twelve'])
    expect(comments.map(c => c.attachments.map(a => a.url))).toEqual([['foo.png'], ['bar.png']])
  })

  it('returns comments for post, ordered by id', () => {
    const session = orm.session(orm.getEmptyState())
    const { Post, Comment } = session;
    [
      { model: Comment, attrs: { id: '4', post: '1', parentComment: null } },
      { model: Comment, attrs: { id: '5', post: '2', parentComment: null } },
      { model: Comment, attrs: { id: '1', post: '1', parentComment: null } },
      { model: Comment, attrs: { id: '3', post: '2', parentComment: null } },
      { model: Comment, attrs: { id: '2', post: '1', parentComment: null } },
      { model: Post, attrs: { id: '1' } },
      { model: Post, attrs: { id: '2' } }
    ].forEach(({ model, attrs }) => model.create(attrs))

    expect(getComments({ orm: session.state }, { postId: '1' }).map(c => c.id))
      .toEqual(['1', '2', '4'])
  })
})
