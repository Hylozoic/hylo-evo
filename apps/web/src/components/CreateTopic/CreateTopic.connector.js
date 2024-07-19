import { connect } from 'react-redux'

import { MODULE_NAME, fetchGroupTopic, createTopic } from './CreateTopic.store'

const mapStateToProps = (state, props) => {
  return {
    groupTopicExists: state[MODULE_NAME]
  }
}

export default connect(mapStateToProps, { createTopic, fetchGroupTopic })
