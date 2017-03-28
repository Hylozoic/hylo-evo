import { connect } from 'react-redux'
import { findMentions, clearMentions, getMentionResults } from './store'

export function mapStateToProps (state, props) {
  return {
    mentionResults: getMentionResults(state, props)
  }
}

export const mapDispatchToProps = {
  findMentions,
  clearMentions
}

export default connect(mapStateToProps, mapDispatchToProps)
