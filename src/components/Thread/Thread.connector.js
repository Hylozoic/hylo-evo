import { connect } from 'react-redux'
import {
  fetchThread,
  fetchBeforeMessages,
  getThread
} from './Thread.store'
import { getMe } from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state.orm),
    thread: getThread(state, props),
    pending: false,
    // TODO: convert to actions
    onThreadPage: () => {},
    offThreadPage: () => {},
    fetchAfterMessages: () => {}
  }
}

export const mapDispatchToProps = {
  fetchThread,
  fetchBeforeMessages
}

export default connect(mapStateToProps, mapDispatchToProps)
