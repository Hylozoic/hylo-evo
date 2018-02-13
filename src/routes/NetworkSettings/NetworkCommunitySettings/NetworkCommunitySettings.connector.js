import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'
import {
  fetchCommunitySettings, updateCommunitySettings
} from '../../CommunitySettings/CommunitySettings.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import {
} from '../NetworkSettings.store'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const slug = props.network.slug
  const me = getMe(state)

  const communitySlug = getParam('slug', state, props)
  const community = getCommunityForCurrentRoute(state, props)
  const moderators = community ? community.moderators.toModelArray() : []

  return {
    isAdmin: me ? me.isAdmin : false,
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
  const { communitySlug } = stateProps
  const fetchCommunitySettings = () =>
    dispatchProps.fetchCommunitySettings(communitySlug)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchCommunitySettings
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
