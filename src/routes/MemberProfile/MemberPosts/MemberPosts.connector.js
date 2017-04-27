import { connect } from 'react-redux'

import { memberPostsSelector, fetchMemberPosts } from './MemberPosts.store'

export function mapStateToProps (state, props) {
  return {
    posts: memberPostsSelector(state, props),
    showDetails: (id, slug) => props.navigate(`/c/${slug}/p/${id}`)
  }
}

export default connect(mapStateToProps, { fetchMemberPosts })
