import { connect } from 'react-redux'
import {
  findCommunities,
  clearCommunities,
  getCommunitiesResults
} from './store'

export function mapStateToProps (state, props) {
  return {
    communitiesResults: getCommunitiesResults(state, props)
  }
}

export const mapDispatchToProps = {
  findCommunities,
  clearCommunities
}

export default connect(mapStateToProps, mapDispatchToProps)
