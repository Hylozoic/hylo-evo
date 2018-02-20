import { connect } from 'react-redux'
import {
  fetchCommunitySettings
} from '../../CommunitySettings/CommunitySettings.store'
import {
  updateCommunityHiddenSetting
} from '../NetworkSettings.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const slug = props.network.slug

  const community = getCommunityForCurrentRoute(state, props)
  const moderators = community ? community.moderators.toModelArray() : []

  return {
    slug,
    community,
    moderators
  }
}

export const mapDispatchToProps = {
  fetchCommunitySettings,
  updateCommunityHiddenSetting
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community } = stateProps
  const fetchCommunitySettings = () =>
    dispatchProps.fetchCommunitySettings(get('slug', community))

  const updateCommunityHiddenSetting = hidden =>
    dispatchProps.updateCommunityHiddenSetting(get('id', community), hidden)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchCommunitySettings,
    updateCommunityHiddenSetting
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
