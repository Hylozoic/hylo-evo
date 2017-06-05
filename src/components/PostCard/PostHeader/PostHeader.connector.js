import { deletePost } from './PostHeader.store'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { communityUrl, allCommunitiesUrl } from 'util/index'

export function mapDispatchToProps (dispatch, props) {
  const { slug } = props
  const deletePostWithConfirm = id => {
    if (window.confirm('are you sure you want to delete this post?')) {
      dispatch(deletePost(id))
      .then(() => dispatch(push(slug ? communityUrl(slug) : allCommunitiesUrl())))
    }
  }

  return {
    deletePost: deletePostWithConfirm
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { id } = ownProps
  const { deletePost } = dispatchProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deletePost: () => deletePost(id)
  }
}

export default connect(null, mapDispatchToProps, mergeProps)
