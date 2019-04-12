import { connect } from 'react-redux'
import {
  findMentions,
  clearMentions,
  getMentionResults,
  findTopics,
  clearTopics,
  getTopicResults
} from './HyloEditor.store'

export function mapStateToProps (state, props) {
  return {
    mentionResults: getMentionResults(state, props),
    topicResults: getTopicResults(state, props)
  }
}

export const mapDispatchToProps = {
  findMentions,
  clearMentions,
  findTopics,
  clearTopics
}

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})
