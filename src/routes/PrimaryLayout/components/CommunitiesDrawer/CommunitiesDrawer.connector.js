import { connect } from 'react-redux'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { toggleCommunitiesDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'

export const getCommunities = ormCreateSelector(
  orm,
  state => state.orm,
  session => {
    return session.Membership.all().toModelArray().map(m => m.community.ref)
  }
)

export function mapStateToProps (state, props) {
  return {
    communities: getCommunities(state),
    communityNotifications: []
  }
}

export const mapDispatchToProps = {
  toggleCommunitiesDrawer
}

export default connect(mapStateToProps, mapDispatchToProps)
