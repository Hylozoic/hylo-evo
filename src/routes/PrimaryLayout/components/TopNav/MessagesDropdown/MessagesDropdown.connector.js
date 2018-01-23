import { connect } from 'react-redux'
import { fetchThreads } from './MessagesDropdown.store.js'
import { push } from 'react-router-redux'
import { threadUrl } from 'utils/index'
import { getThreads } from 'components/ThreadList/ThreadList.store'
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
    fetchThreads: () => dispatch(fetchThreads()),
    goToThread: id => dispatch(push(threadUrl(id)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
