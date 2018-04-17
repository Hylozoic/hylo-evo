import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import fetchPost from 'store/actions/fetchPost'
import getParam from 'store/selectors/getParam'
import getPost, { presentPost } from 'store/selectors/getPost'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { FETCH_POST } from 'store/constants'

export function mapStateToProps (state, props) {
  const slug = getParam('slug', state, props)
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const communityId = currentCommunity && currentCommunity.id
  return {
    post: presentPost(getPost(state, props), (communityId)),
    id: getParam('postId', state, props),
    currentUser: getMe(state),
    slug,
    pending: state.pending[FETCH_POST]
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const { location } = props

  const removePostDetailFromPath = pathname =>
    pathname.replace(/\/p\/(.+)/, '')

  const closeLocation = {
    ...props.location,
    pathname: removePostDetailFromPath(location.pathname)
  }

  const postId = getParam('postId', {}, props)

  return {
    fetchPost: () => dispatch(fetchPost(postId)),
    onClose: () => dispatch(push(closeLocation)),
    editPost: () => dispatch(push(`${postId}/edit`))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
