import { connect } from 'react-redux'
import toggleGroupTopicSubscribe from 'store/actions/toggleGroupTopicSubscribe'

const mapDispatchToProps = {
  toggleGroupTopicSubscribe
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...dispatchProps,
    ...ownProps,
    toggleSubscribe: () => dispatchProps.toggleGroupTopicSubscribe(ownProps.groupsTopic)
  }
}

export default connect(null, mapDispatchToProps, mergeProps)
