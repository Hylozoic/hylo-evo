import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import presentGroup from 'store/presenters/presentGroup'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { getParentGroups } from 'store/selectors/getGroupRelationships'
import getRouteParam from 'store/selectors/getRouteParam'
import getCanModerate from 'store/selectors/getCanModerate'
import getMe from 'store/selectors/getMe'
import {
  fetchGroupSettings, updateGroupSettings, deleteGroup
} from './GroupSettings.store'
import { allGroupsUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  const slug = getRouteParam('groupSlug', state, props, false)
  const group = getGroupForCurrentRoute(state, props)
  const canModerate = getCanModerate(state, { group })
  const currentUser = getMe(state)
  const parentGroups = group ? getParentGroups(state, { groupSlug: group.slug }) : []

  return {
    canModerate,
    currentUser,
    group: group ? presentGroup(group) : null,
    parentGroups,
    slug
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    deleteGroup: id => dispatch(deleteGroup(id)),
    fetchGroupSettingsMaker: slug => () => dispatch(fetchGroupSettings(slug)),
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
            // Reload app instead of just going to the home peage because correctly updating redux-orm after group deletion is hard
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
