import { connect } from 'react-redux'
import { times, merge } from 'lodash/fp'
import { SAMPLE_COMMUNITY } from 'routes/Feed/sampleData'
import { toggleCommunitiesDrawer } from 'routes/PrimaryLayout/actions'

export function mapStateToProps (state, props) {
  return {
    currentCommunity: SAMPLE_COMMUNITY,
    communities: times(i => merge({id: i}, SAMPLE_COMMUNITY), 4),
    communityNotifications: times(i => (i % 2 === 0 ? {communityId: i, count: 1} : null), 4)
  }
}

export const mapDispatchToProps = {
  toggleCommunitiesDrawer
}

export default connect(mapStateToProps, mapDispatchToProps)
