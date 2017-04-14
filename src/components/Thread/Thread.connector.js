import { connect } from 'react-redux'
import {
  fetchThread,
  fetchBeforeMessages,
  getThread
} from './Thread.store'
import { getMe } from 'store/selectors/getMe'
import { FETCH_BEFORE_MESSAGES } from 'store/constants'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    thread: getThread(state, props),
    pending: !!state.pending[FETCH_BEFORE_MESSAGES],
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
