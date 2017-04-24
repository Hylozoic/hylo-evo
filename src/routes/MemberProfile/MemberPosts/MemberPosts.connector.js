import { connect } from 'react-redux'

import { memberPostsSelector, fetchMemberPosts } from './MemberPosts.store'

export function mapStateToProps (state, props) {
  return {
    posts: memberPostsSelector(state, props)
  }
}

export default connect(mapStateToProps, { fetchMemberPosts })
