import { connect } from 'react-redux'
import { get, find } from 'lodash/fp'
import { push } from 'react-router-redux'
import fetchPost from 'store/actions/fetchPost'
import getParam from 'store/selectors/getParam'
import getPost, { presentPost } from 'store/selectors/getPost'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import voteOnPost from 'store/actions/voteOnPost.js'
import joinProject from 'store/actions/joinProject'
import leaveProject from 'store/actions/leaveProject'
import { FETCH_POST } from 'store/constants'

export function mapStateToProps (state, props) {
  const id = getParam('postId', state, props)
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const post = presentPost(getPost(state, props), get('id', currentCommunity))
  const slug = getParam('slug', state, props)
  const currentUser = getMe(state)
  const isProjectMember = find(({id}) => id === get('id', currentUser), get('members', post))

  return {
    id,
    post,
    currentUser,
    slug,
    isProjectMember,
    pending: state.pending[FETCH_POST]
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { location } = props
  const id = getParam('postId', {}, props)
  const removePostDetailFromPath = pathname => {
    pathname
      .replace(/\/project\/(.+)/, '')
  }
  const closeLocation = {
    ...props.location,
    pathname: removePostDetailFromPath(location.pathname)
  }

  return {
    fetchPost: () => dispatch(fetchPost(id)),
    onClose: () => dispatch(push(closeLocation)),
    editPost: () => dispatch(push(`${id}/edit`)),
    joinProject: () => dispatch(joinProject(id)),
    leaveProject: () => dispatch(leaveProject(id)),
    voteOnPost: (id, myVote) => dispatch(voteOnPost(id, myVote))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
