import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl } from 'util/index'

import { memberPostsSelector, fetchMemberPosts } from './MemberPosts.store'

export function mapStateToProps (state, props) {
  return {
    posts: memberPostsSelector(state, props)
  }
}

export const mapDispatchToProps = {
  fetchMemberPosts,
  showDetails: (id, slug, memberId) => push(postUrl(id, slug, {memberId}))
}

export default connect(mapStateToProps, mapDispatchToProps)
