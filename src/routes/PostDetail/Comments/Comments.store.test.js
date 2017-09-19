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
                  text: 'eleven',
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
    const comments = getComments(state, {postId: 1})
    expect(comments.length).toEqual(2)
    expect(comments.map(c => c.text)).toEqual(['eleven', 'twelve'])
    expect(comments.map(c => c.image.url)).toEqual(['foo.png', 'bar.png'])
  })
})
