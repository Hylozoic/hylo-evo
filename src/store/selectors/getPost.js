import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import getParam from 'store/selectors/getParam'

const getPost = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => getParam('postId', state, props),
  ({ Post }, id) => {
    try {
      return Post.get({id})
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
    pinned,
    topics: post.topics.toModelArray(),
    members:  post.members.toModelArray().map(person => {
      return {
        ...person.ref,
        skills: person.skills.toRefArray()
      }
    })
  }
}

export default getPost
