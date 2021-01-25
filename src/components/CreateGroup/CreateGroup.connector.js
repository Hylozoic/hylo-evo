import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { get, omit } from 'lodash/fp'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMe from 'store/selectors/getMe'
import { postsUrl, postUrl } from 'util/navigation'
import { createGroup, fetchGroupExists } from './CreateGroup.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const parent = getGroupForCurrentRoute(state, props)
  const parentGroupOptions = (currentUser && currentUser.memberships.toModelArray().map((m) => m.group))

  return {
    groupSlugExists: get('slugExists', state.CreateGroup),
    parentGroupOptions,
    parentGroups: parent ? [parent] : []
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const routeParams = get('match.params', props)
  const { postId, slug, context } = routeParams
  const urlParams = {
    groupSlug: slug,
    ...omit(['postId', 'action', 'slug'], routeParams),
    context
  }
  const closeUrl = postId
    ? postUrl(postId, urlParams)
    : postsUrl(urlParams)

  return {
    closeModal: () => dispatch(push(closeUrl)),
    createGroup: (name, slug, parentIds) => dispatch(createGroup(name, slug, parentIds)),
    fetchGroupExists: (slug) => dispatch(fetchGroupExists(slug)),
    goToGroup: (slug) => dispatch(push(`/g/${slug}`)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
