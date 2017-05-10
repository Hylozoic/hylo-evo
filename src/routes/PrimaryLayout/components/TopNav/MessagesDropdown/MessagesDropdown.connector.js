import { connect } from 'react-redux'
import { fetchThreads } from './MessagesDropdown.store.js'
import { push } from 'react-router-redux'
import { threadUrl } from 'util/index'
import { getThreads } from 'components/ThreadList/ThreadList.store'
import { getMe } from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props),
    threads: getThreads(state, props),
    topNavPosition: state.TopNav
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchThreads: () => dispatch(fetchThreads()),
    goToThread: id => () => dispatch(push(threadUrl(id)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
