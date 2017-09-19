import { getComments } from './Comments.store'
import orm from 'store/models'
import extractModelsFromAction from 'store/reducers/ModelExtractor/extractModelsFromAction'

describe('getComments', () => {
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
                  attachments: [
                    {
                      id: 111,
                      url: 'foo.png'
                    }
                  ]
                },
                {
                  id: 12,
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
      meta: {extractModel: 'Post'}
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
                  attachments: [
                    {
                      id: 211,
                      url: 'foo2.png'
                    }
                  ]
                },
                {
                  id: 22,
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
      meta: {extractModel: 'Post'}
    }
  ]

  extractModelsFromAction(setupActions[0], session)
  extractModelsFromAction(setupActions[1], session)
  it('rocks', () => {
    const state = {
      orm: session.state
    }
    console.log('state.Post', JSON.stringify(session.state.Post))
    console.log('state.Comment', JSON.stringify(session.state.Comment))
    console.log('state.Attachment', JSON.stringify(session.state.Attachment))
    const comments = getComments(state, {postId: 1})
    console.log('length', session.Post.withId(1).comments.toModelArray().length)
    console.log('comments', comments)
  })
})
