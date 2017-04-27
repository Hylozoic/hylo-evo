import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { memberPostsSelector, fetchMemberPosts } from './MemberPosts.store'

export function mapStateToProps (state, props) {
  return {
    posts: memberPostsSelector(state, props)
  }
}

export const mapDispatchToProps = {
  fetchMemberPosts,
  showDetails: (id, slug) => push(`/c/${slug}/p/${id}`)
}

export default connect(mapStateToProps, mapDispatchToProps)
