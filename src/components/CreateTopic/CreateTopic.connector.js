import { connect } from 'react-redux'

import { MODULE_NAME, fetchCommunityTopic, createTopic } from './CreateTopic.store'

const mapStateToProps = (state, props) => {
  return {
    communityTopicExists: state[MODULE_NAME]
  }
}

export default connect(mapStateToProps, { createTopic, fetchCommunityTopic })
