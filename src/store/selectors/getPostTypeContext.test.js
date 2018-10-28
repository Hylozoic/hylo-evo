import getPostTypeContext from './getPostTypeContext'
import {
  POST_TYPE_CONTEXTS,
  DEFAULT_POST_TYPE_CONTEXT
} from 'util/navigation'
// NOTE: getParam can also be mocked as follows to bypass testing getParam
//       at the same time.
// jest.mock('./getParam', () => (key, state, props) => 'projects')

describe('getPostTypeContext', () => {
  it('gets post type context ', () => {
    const props = {
      match: {
        params: {
          postTypeContext: POST_TYPE_CONTEXTS[0]
        }
      }
    }
    console.log(props)

    expect(getPostTypeContext(null, props)).toEqual(POST_TYPE_CONTEXTS[0])
  })

  it('returns nothing if in default context', () => {
    const props = {
      match: {
        params: {
          postTypeContext: DEFAULT_POST_TYPE_CONTEXT
        }
      }
    }

    expect(getPostTypeContext(null, props)).toBeFalsy()
  })
})
