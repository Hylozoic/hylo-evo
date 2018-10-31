import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { get } from 'lodash/fp'
import { postUrl, editPostUrl } from 'util/navigation'
import voteOnPost from 'store/actions/voteOnPost'
import {
  memberPostsSelector,
  fetchMemberPosts
} from './MemberPosts.store'

export function mapStateToProps (state, props) {
  return {
    selectedPostId: get('postId', props),
    posts: memberPostsSelector(state, props)
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    fetchMemberPosts: (memberId) => dispatch(fetchMemberPosts(memberId)),
    showDetails: (postId, opts) => dispatch(push(postUrl(postId, opts))),
    editPost: (postId, opts) => dispatch(push(editPostUrl(postId, opts))),
    voteOnPost: (postId, myVote) => dispatch(dispatch(voteOnPost(postId, myVote)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
