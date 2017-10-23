import { mapStateToProps, mapDispatchToProps, mergeProps } from './PostEditor.connector'
import orm from 'store/models'
import {
  CREATE_POST,
  MODULE_NAME,
  FETCH_LINK_PREVIEW,
  createPost,
  updatePost,
  pollingFetchLinkPreview,
  removeLinkPreview,
  clearLinkPreview,
  getLinkPreview
} from './PostEditor.store'

let state
beforeAll(() => {
  const session = orm.session(orm.getEmptyState())
  const community = session.Community.create({id: '99', slug: 'foo'})
  session.LinkPreview.create({
    id: 1
  })

  session.Me.create({
    id: '1',
    memberships: [session.Membership.create({
      id: '345',
      community: community.id,
      hasModeratorRole: true
    })]
  })

  state = {
    orm: session.state,
    PostEditor: {
      linkPreviewStatus: false
    },
    pending: {
      FETCH_LINK_PREVIEW: false
    },
    AttachmentManager: {
      image: [],
      file: []
    }
  }
})

describe('mapStateToProps', () => {
  it('returns the right keys for a new post', () => {
    const props = {
      forNew: true,
      match: {
        params: {
          slug: 'foo'
        }
      }
    }
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})
