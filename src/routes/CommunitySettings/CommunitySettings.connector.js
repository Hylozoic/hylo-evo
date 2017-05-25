import { connect } from 'react-redux'
import {
  fetchCommunitySettings, updateCommunitySettings, findModerators
} from './CommunitySettings.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getParam from 'store/selectors/getParam'
import { get } from 'lodash/fp'
import { fakePerson } from 'components/PostCard/samplePost'

const moderators = fakePerson(7)

export function mapStateToProps (state, props) {
  const slug = getParam('slug', state, props, false)
  const community = getCommunityForCurrentRoute(state, props)
  return {
    moderators,
    community,
    slug
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchCommunitySettingsMaker: slug => () => dispatch(fetchCommunitySettings(slug)),
    updateCommunitySettingsMaker: id => changes => dispatch(updateCommunitySettings(id, changes)),
    removeModerator: id => console.log('removing moderator', id),
    findModeratorsMaker: slug => autocomplete => dispatch(findModerators(slug, autocomplete))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, slug } = stateProps
  const {
    fetchCommunitySettingsMaker, updateCommunitySettingsMaker, findModeratorsMaker
   } = dispatchProps
  var fetchCommunitySettings, updateCommunitySettings, findModerators

  if (slug) {
    fetchCommunitySettings = fetchCommunitySettingsMaker(slug)
    findModerators = findModeratorsMaker(slug)
  } else {
    fetchCommunitySettings = () => {}
    findModerators = () => {}
  }

  console.log('findModeratorsMaker', findModeratorsMaker)
  console.log('findModerators', findModerators)

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
    updateCommunitySettings,
    findModerators
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
