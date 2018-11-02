import { connect } from 'react-redux'
import {
  getMemberPosts,
  fetchMemberPosts
} from './MemberPosts.store'

export function mapStateToProps (state, props) {
  return {
    posts: getMemberPosts(state, props)
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    fetchMemberPosts: (memberId) => dispatch(fetchMemberPosts(memberId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
