import { push } from 'connected-react-router'
import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getRouteParam from 'store/selectors/getRouteParam'
import getCanModerate from 'store/selectors/getCanModerate'
import getMe from 'store/selectors/getMe'
import {
  fetchGroupSettings, updateGroupSettings, deleteGroup
} from './GroupSettings.store'
import { groupDeleteConfirmationUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  const slug = getRouteParam('groupSlug', state, props, false)
  const group = getGroupForCurrentRoute(state, props)
  const canModerate = getCanModerate(state, { group })

  return {
    canModerate,
    group,
    currentUser: getMe(state),
    slug
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    deleteGroup: id => dispatch(deleteGroup(id)),
    fetchGroupSettingsMaker: slug => () => dispatch(fetchGroupSettings(slug)),
    goToGroupDeleteConfirmation: () => dispatch(push(groupDeleteConfirmationUrl())),
    updateGroupSettingsMaker: id => changes => dispatch(updateGroupSettings(id, changes))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { group, slug } = stateProps
  const {
    fetchGroupSettingsMaker, goToGroupDeleteConfirmation, updateGroupSettingsMaker
  } = dispatchProps
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
            return goToGroupDeleteConfirmation()
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
