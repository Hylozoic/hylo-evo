import { connect } from 'react-redux'
import { findMentions, getMentionResults } from './store'

export function mapStateToProps (state, props) {
  return {
    mentionResults: getMentionResults(state, props)
  }
}

export const mapDispatchToProps = {
  findMentions
}

export default connect(mapStateToProps, mapDispatchToProps)
