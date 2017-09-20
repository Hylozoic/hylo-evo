import { connect } from 'react-redux'
import {
  fetchCommunitySettings, updateCommunitySettings
} from './CommunitySettings.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getMe from 'store/selectors/getMe'
import getParam from 'store/selectors/getParam'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const slug = getParam('slug', state, props, false)
  const community = getCommunityForCurrentRoute(state, props)
  const currentUser = getMe(state, props)
  const canModerate = currentUser && currentUser.canModerate(community)

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
