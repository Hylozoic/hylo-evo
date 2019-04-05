import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import fetchThreads from 'store/actions/fetchThreads'
import { setThreadSearch, getThreadSearch, getThreads, getThreadsHasMore } from './ThreadList.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    threadSearch: getThreadSearch(state, props),
    threads: getThreads(state, props),
    hasMore: getThreadsHasMore(state, props)
  }
}

export const mapDispatchToProps = {
  fetchThreads,
  setThreadSearch
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { threads, hasMore } = stateProps
  const { holochainMode } = ownProps

  const fetchThreads = () => dispatchProps.fetchThreads(20, 0, holochainMode)

  const fetchMoreThreads =
    hasMore
      ? () => dispatchProps.fetchThreads(20, threads.length)
      : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchThreads,
    fetchMoreThreads
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
