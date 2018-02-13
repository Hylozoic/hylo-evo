import { connect } from 'react-redux'
import {
  fetchCommunitySettings, updateCommunitySettings
} from '../../CommunitySettings/CommunitySettings.store'
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
  updateCommunitySettings
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community } = stateProps
  const fetchCommunitySettings = () =>
    dispatchProps.fetchCommunitySettings(get('slug', community))

  const updateCommunitySettings = changes =>
    dispatchProps.updateCommunitySettings(get('id', community), changes)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchCommunitySettings,
    updateCommunitySettings
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
