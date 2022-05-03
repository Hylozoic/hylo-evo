import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { messageThreadUrl } from 'util/navigation'
import fetchThreads from 'store/actions/fetchThreads'
import { getThreads } from 'routes/Messages/Messages.store'
import getMe from 'store/selectors/getMe'
import { FETCH_THREADS } from 'store/constants'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props),
    threads: getThreads(state, props),
    pending: state.pending[FETCH_THREADS]
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchThreads: () => dispatch(fetchThreads(10, 0)),
    goToThread: id => dispatch(push(messageThreadUrl(id)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
