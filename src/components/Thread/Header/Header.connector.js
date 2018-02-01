import { connect } from 'react-redux'
import { getOthers, getThreadId } from './Header.store'

export function mapStateToProps (state, props) {
  return {
    otherParticipants: getOthers(props),
    threadId: getThreadId(props)
  }
}

export default connect(mapStateToProps)
