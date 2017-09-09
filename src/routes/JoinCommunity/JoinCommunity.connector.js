import { connect } from 'react-redux'
import { find, get } from 'lodash/fp'
import getQueryParam from 'store/selectors/getQueryParam'
import getMe from 'store/selectors/getMe'
import getMemberships from 'store/selectors/getMemberships'
import { useInvitation } from './JoinCommunity.store'

export function mapStateToProps (state, props) {
  const newMembership = get('JoinCommunity.membership', state)

  return {
    currentUser: getMe(state),
    invitationToken: getQueryParam('token', state, props),
    communitySlug: get('community.slug', newMembership)
  }
}

export const mapDispatchToProps = {
  useInvitation
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    useInvitation: (userId) =>
      dispatchProps.useInvitation(userId, stateProps.invitationToken)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
