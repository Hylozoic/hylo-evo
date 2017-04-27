import { connect } from 'react-redux'
import {
  fetchThread,
  getThread
} from './Thread.store'
import { getMe } from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    thread: getThread(state, props)
  }
}

export const mapDispatchToProps = {
  fetchThread
}

export default connect(mapStateToProps, mapDispatchToProps)
