import { connect } from 'react-redux'
import { get, find } from 'lodash/fp'
import { push } from 'react-router-redux'
import fetchPost from 'store/actions/fetchPost'
import getParam from 'store/selectors/getParam'
import getPost, { presentPost } from 'store/selectors/getPost'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import joinProject from 'store/actions/joinProject'
import leaveProject from 'store/actions/leaveProject'
import { FETCH_POST } from 'store/constants'

export function mapStateToProps (state, props) {
  const id = getParam('postId', state, props)
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const post = presentPost(getPost(state, props), get('id', currentCommunity))
  const slug = getParam('slug', state, props)
  const currentUser = getMe(state)
  const isProjectMember = find(({id}) => id === currentUser.id, get('members', post))

  return {
    id,
    post,
    currentUser,
    slug,
    isProjectMember,
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
    editPost: () => dispatch(push(`${postId}/edit`)),
    joinProject: () => dispatch(joinProject(postId)),
    leaveProject: () => dispatch(leaveProject(postId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
