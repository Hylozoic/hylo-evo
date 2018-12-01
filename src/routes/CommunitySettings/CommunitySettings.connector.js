import { connect } from 'react-redux'
import {
  fetchCommunitySettings, updateCommunitySettings
} from './CommunitySettings.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getRouteParam from 'store/selectors/getRouteParam'
import { get } from 'lodash/fp'
import getCanModerate from 'store/selectors/getCanModerate'

export function mapStateToProps (state, props) {
  const slug = getRouteParam('slug', state, props, false)
  const community = getCommunityForCurrentRoute(state, props)
  const canModerate = getCanModerate(state, {community})

  return {
    community,
    slug,
    canModerate
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchCommunitySettingsMaker: slug => () => dispatch(fetchCommunitySettings(slug)),
    updateCommunitySettingsMaker: id => changes => dispatch(updateCommunitySettings(id, changes))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, slug } = stateProps
  const {
    fetchCommunitySettingsMaker, updateCommunitySettingsMaker
   } = dispatchProps
  var fetchCommunitySettings, updateCommunitySettings

  if (slug) {
    fetchCommunitySettings = fetchCommunitySettingsMaker(slug)
  } else {
    fetchCommunitySettings = () => {}
  }

  if (get('id', community)) {
    updateCommunitySettings = updateCommunitySettingsMaker(community.id)
  } else {
    updateCommunitySettings = () => {}
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchCommunitySettings,
    updateCommunitySettings
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
