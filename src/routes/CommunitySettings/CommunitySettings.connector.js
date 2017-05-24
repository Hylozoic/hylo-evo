import { connect } from 'react-redux'
import {
  fetchCommunitySettings, updateCommunitySettings
} from './CommunitySettings.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getParam from 'store/selectors/getParam'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const slug = getParam('slug', state, props, false)
  const community = getCommunityForCurrentRoute(state, props)
  return {
    community,
    slug
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchCommunitySettingsMaker: id => () => dispatch(fetchCommunitySettings(id)),
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
