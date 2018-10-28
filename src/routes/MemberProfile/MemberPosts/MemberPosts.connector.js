import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl } from 'util/navigation'

import { memberPostsSelector, fetchMemberPosts } from './MemberPosts.store'

export function mapStateToProps (state, props) {
  return {
    posts: memberPostsSelector(state, props)
  }
}

export const mapDispatchToProps = {
  fetchMemberPosts,
  showDetails: (id, communitySlug, memberId) => push(postUrl(id, {communitySlug, memberId})),
  editPost: (id, communitySlug, memberId) => push(postUrl(id, {communitySlug, action: 'edit', memberId}))
}

export default connect(mapStateToProps, mapDispatchToProps)
