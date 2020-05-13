import { connect } from 'react-redux'
import {
  fetchCommunitySettings, updateCommunitySettings, deleteCommunity
} from './CommunitySettings.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getRouteParam from 'store/selectors/getRouteParam'
import { get } from 'lodash/fp'
import getCanModerate from 'store/selectors/getCanModerate'
import getMe from 'store/selectors/getMe'
import { push } from 'connected-react-router'
import { communityDeleteConfirmationUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  const slug = getRouteParam('slug', state, props, false)
  const community = getCommunityForCurrentRoute(state, props)
  const canModerate = getCanModerate(state, { community })

  return {
    community,
    currentUser: getMe(state),
    slug,
    canModerate
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchCommunitySettingsMaker: slug => () => dispatch(fetchCommunitySettings(slug)),
    updateCommunitySettingsMaker: id => changes => dispatch(updateCommunitySettings(id, changes)),
    deleteCommunity: id => dispatch(deleteCommunity(id)),
    goToCommunityDeleteConfirmation: () => dispatch(push(communityDeleteConfirmationUrl()))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, slug } = stateProps
  const {
    fetchCommunitySettingsMaker, updateCommunitySettingsMaker, goToCommunityDeleteConfirmation
  } = dispatchProps
  var fetchCommunitySettings, updateCommunitySettings, deleteCommunity

  if (slug) {
    fetchCommunitySettings = fetchCommunitySettingsMaker(slug)
  } else {
    fetchCommunitySettings = () => {}
  }

  if (get('id', community)) {
    updateCommunitySettings = updateCommunitySettingsMaker(community.id)
    deleteCommunity = () =>
      dispatchProps.deleteCommunity(community.id)
        .then(({ error }) => {
          if (!error) {
            return goToCommunityDeleteConfirmation()
          }
        })
  } else {
    updateCommunitySettings = () => {}
    deleteCommunity = () => {}
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchCommunitySettings,
    updateCommunitySettings,
    deleteCommunity
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
