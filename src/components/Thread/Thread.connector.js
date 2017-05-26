import { connect } from 'react-redux'
import {
  fetchThread,
  getThread
} from './Thread.store'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    thread: getThread(state, props),
    id: props.match.params.threadId
  }
}

function mapDispatchToProps (dispatch, props) {
  const { threadId } = props.match.params

  return {
    fetchThread: () => dispatch(fetchThread(threadId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
