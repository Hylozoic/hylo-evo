import { connect } from 'react-redux'
import { get, find } from 'lodash/fp'
import { push } from 'react-router-redux'
import { removePostFromUrl } from 'util/navigation'
import fetchPost from 'store/actions/fetchPost'
import getParam from 'store/selectors/getParam'
import getPost, { presentPost } from 'store/selectors/getPost'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getPostTypeContext from 'store/selectors/getPostTypeContext'
import voteOnPost from 'store/actions/voteOnPost'
import joinProject from 'store/actions/joinProject'
import leaveProject from 'store/actions/leaveProject'
import processStripeToken from 'store/actions/processStripeToken'
import { FETCH_POST } from 'store/constants'

export function mapStateToProps (state, props) {
  // match params
  const id = getParam('postId', state, props)
  const personId = getParam('personId', state, props)
  const slug = getParam('slug', state, props)
  const networkSlug = getParam('networkSlug', state, props)
  // everything else
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const post = presentPost(getPost(state, props), get('id', currentCommunity))
  const postTypeContext = getPostTypeContext(state, props)
  const currentUser = getMe(state)
  const isProjectMember = find(({id}) => id === get('id', currentUser), get('members', post))

  return {
    id,
    personId,
    slug,
    networkSlug,
    postTypeContext,
    post,
    currentUser,
    isProjectMember,
    pending: state.pending[FETCH_POST]
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { location } = props
  const postId = getParam('postId', {}, props)
  const closeLocation = {
    ...props.location,
    pathname: removePostFromUrl(location.pathname)
  }

  return {
    fetchPost: () => dispatch(fetchPost(postId)),
    onClose: () => dispatch(push(closeLocation)),
    joinProject: postId => dispatch(joinProject(postId)),
    leaveProject: postId => dispatch(leaveProject(postId)),
    voteOnPost: (postId, myVote) => dispatch(voteOnPost(postId, myVote)),
    processStripeToken: (postId, token, amount) => dispatch(processStripeToken(postId, token, amount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
