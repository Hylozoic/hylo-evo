import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'
import { fetchThreads, getThreads } from './ThreadList.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    threads: getThreads(state, props)
  }
}

export const mapDispatchToProps = {
  fetchThreads
}

export default connect(mapStateToProps, mapDispatchToProps)
