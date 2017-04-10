import { connect } from 'react-redux'
import {
  findSuggestions,
  clearSuggestions,
  getCommunitiesResults
} from './store'

export function mapStateToProps (state, props) {
  return {
    communitiesResults: getCommunitiesResults(state, props)
  }
}

export const mapDispatchToProps = {
  findSuggestions,
  clearSuggestions
}

export default connect(mapStateToProps, mapDispatchToProps)
