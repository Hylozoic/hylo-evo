import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import presentGroup from 'store/presenters/presentGroup'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { getParentGroups } from 'store/selectors/getGroupRelationships'
import getRouteParam from 'store/selectors/getRouteParam'
import getCommonRoles from 'store/selectors/getCommonRoles'
import getMe from 'store/selectors/getMe'
import {
  FETCH_COLLECTION_POSTS,
  FETCH_GROUP_SETTINGS,
  addPostToCollection,
  createCollection,
  deleteGroup,
  fetchCollectionPosts,
  fetchGroupSettings,
  removePostFromCollection,
  reorderPostInCollection,
  updateGroupSettings
} from './GroupSettings.store'
import { allGroupsUrl } from 'util/navigation'
import { fetchLocation } from 'components/LocationInput/LocationInput.store'

export function mapStateToProps (state, props) {
  const slug = getRouteParam('groupSlug', props, false)
  const group = getGroupForCurrentRoute(state, props)
  const currentUser = getMe(state)
  const parentGroups = group ? getParentGroups(state, { groupSlug: group.slug }) : []
  const commonRoles = getCommonRoles(state)

  return {
    commonRoles,
    currentUser,
    fetchPending: state.pending[FETCH_GROUP_SETTINGS],
    fetchCollectionPostsPending: state.pending[FETCH_COLLECTION_POSTS],
    group: group ? presentGroup(group) : null,
    parentGroups,
    slug
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    addPostToCollection: (collectionId, postId) => dispatch(addPostToCollection(collectionId, postId)),
    createCollection: (data) => dispatch(createCollection(data)),
    deleteGroup: id => dispatch(deleteGroup(id)),
    fetchCollectionPosts: id => dispatch(fetchCollectionPosts(id)),
    fetchGroupSettingsMaker: slug => () => dispatch(fetchGroupSettings(slug)),
    fetchLocation: (location) => dispatch(fetchLocation(location)),
    removePostFromCollection: (collectionId, postId) => dispatch(removePostFromCollection(collectionId, postId)),
    reorderPostInCollection: (collectionId, postId, newOrderIndex) => dispatch(reorderPostInCollection(collectionId, postId, newOrderIndex)),
    updateGroupSettingsMaker: id => changes => dispatch(updateGroupSettings(id, changes))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { group, slug } = stateProps
  const { fetchGroupSettingsMaker, updateGroupSettingsMaker } = dispatchProps
  let deleteGroup, fetchGroupSettings, updateGroupSettings

  if (slug) {
    fetchGroupSettings = fetchGroupSettingsMaker(slug)
  } else {
    fetchGroupSettings = () => {}
  }

  if (get('id', group)) {
    deleteGroup = () =>
      dispatchProps.deleteGroup(group.id)
        .then(({ error }) => {
          if (!error) {
            // Reload app instead of just going to the home page because correctly updating redux-orm after group deletion is hard
            window.location = allGroupsUrl()
          }
        })
    updateGroupSettings = updateGroupSettingsMaker(group.id)
  } else {
    deleteGroup = () => {}
    updateGroupSettings = () => {}
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deleteGroup,
    fetchGroupSettings,
    updateGroupSettings
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
