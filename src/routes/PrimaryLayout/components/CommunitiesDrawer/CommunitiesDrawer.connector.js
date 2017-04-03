import { connect } from 'react-redux'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { times, merge } from 'lodash/fp'
import { SAMPLE_COMMUNITY } from 'routes/Feed/sampleData'
import { toggleCommunitiesDrawer } from 'routes/PrimaryLayout/actions'

export const getCommunities = ormCreateSelector(orm, (session) => {
  return session.Membership.all().toModelArray().map(m => m.community.ref)
})

export function mapStateToProps (state, props) {
  return {
    currentCommunity: SAMPLE_COMMUNITY,
    communities: getCommunities(state.orm),
    communityNotifications: [] //times(i => (i % 2 === 0 ? {communityId: i, count: 1} : null), 4)
  }
}

export const mapDispatchToProps = {
  toggleCommunitiesDrawer
}

export default connect(mapStateToProps, mapDispatchToProps)
