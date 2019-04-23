import { connect } from 'react-redux'
import {
  findTopics,
  clearTopics,
  getTopicResults
} from '../HyloEditor/HyloEditor.store'

export function mapStateToProps (state, props) {
  return {
    topicResults: getTopicResults(state, props)
  }
}

export const mapDispatchToProps = {
  findTopics,
  clearTopics
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })
