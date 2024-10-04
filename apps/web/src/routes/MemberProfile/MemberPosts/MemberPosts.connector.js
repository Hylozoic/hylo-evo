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

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchMemberPosts: () => dispatch(fetchMemberPosts(props.routeParams.personId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
