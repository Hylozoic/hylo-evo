import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'
import { fetchThreads, setThreadSearch, getThreadSearch, getThreads } from './ThreadList.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    threadSearch: getThreadSearch(state, props),
    threads: getThreads(state, props)
  }
}

export const mapDispatchToProps = {
  fetchThreads,
  setThreadSearch
}

export default connect(mapStateToProps, mapDispatchToProps)
