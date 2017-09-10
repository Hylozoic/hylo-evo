import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { updateUserSettings } from 'store/actions/updateUserSettings'
import { addCommunityName, addCommunityDomain } from '../CreateCommunity.store'
import { createCommunity } from './Review.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    communityDomain: get('domain', state.CreateCommunity),
    communityName: get('name', state.CreateCommunity),
    communityPrivacy: get('privacy', state.CreateCommunity)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/')),
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes)),
    removeNameFromCreateCommunity: () => dispatch(addCommunityName(null)),
    removeDomainFromCreateCommunity: () => dispatch(addCommunityDomain(null)),
    createCommunity: (name, slug) => dispatch(createCommunity(name, slug))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
