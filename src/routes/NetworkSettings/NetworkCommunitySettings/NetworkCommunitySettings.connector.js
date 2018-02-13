import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'
import {
  fetchCommunitySettings, updateCommunitySettings
} from '../../CommunitySettings/CommunitySettings.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import {
} from '../NetworkSettings.store'

export function mapStateToProps (state, props) {
  const slug = props.network.slug

  const communitySlug = getParam('slug', state, props)
  const community = getCommunityForCurrentRoute(state, props)
  const moderators = community ? community.moderators.toModelArray() : []

  return {
    slug,
    communitySlug,
    community,
    moderators
  }
}

export const mapDispatchToProps = {
  fetchCommunitySettings,
  updateCommunitySettings
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { communitySlug, community: { id } } = stateProps
  const fetchCommunitySettings = () =>
    dispatchProps.fetchCommunitySettings(communitySlug)

  const updateCommunitySettings = changes =>
    dispatchProps.updateCommunitySettings(id, changes)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchCommunitySettings,
    updateCommunitySettings
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
