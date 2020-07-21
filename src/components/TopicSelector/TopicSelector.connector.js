import { includes } from 'lodash'
import { connect } from 'react-redux'
import {
  findTopics,
  clearTopics,
  getTopicResults,
  getTopicsSearchTerm
} from '../HyloEditor/HyloEditor.store'

export function mapStateToProps (state, props) {
  // TODO: move this into a store file somewhere... but where?
  const defaultTopics = props.defaultTopics && getTopicsSearchTerm(state) ? props.defaultTopics.filter(topic => includes(
    topic.name && topic.name.toLowerCase(),
    getTopicsSearchTerm(state).toLowerCase()
  )) : props.defaultTopics

  return {
    defaultTopics,
    topicResults: getTopicResults(state, props)
  }
}

export const mapDispatchToProps = {
  findTopics,
  clearTopics
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })
