import { createSelector } from 'reselect'
import orm from 'store/models'
import getParam from 'store/selectors/getParam'

// FIXME why isn't this ormCreateSelector?
const getPost = createSelector(
  state => state,
  state => orm.session(state.orm),
  (state, props) => getParam('postId', state, props),
  (state, session, id) => {
    try {
      return session.Post.get({id})
    } catch (e) {
      return null
    }
  }
)

export const presentPost = (post, communityId) => {
  if (!post) return null
  const postMembership = post.postMemberships.filter(p =>
    Number(p.community) === Number(communityId)).toRefArray()[0]
  const pinned = postMembership && postMembership.pinned
  return {
    ...post.ref,
    creator: post.creator,
    linkPreview: post.linkPreview,
    commenters: post.commenters.toModelArray(),
    communities: post.communities.toModelArray(),
    fileAttachments: post.attachments.filter(a => a.type === 'file').toModelArray(),
    pinned
  }
}

export default getPost
