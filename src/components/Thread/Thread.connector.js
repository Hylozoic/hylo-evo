import { connect } from 'react-redux'
// import { someAction } from 'some/path/to/actions'
import getCurrentUser from 'store/selectors/getCurrentUser'
import thread, { messages } from './sampleData'

// TODO: convert to actions
const fetchAfter = () => {}
const fetchBefore = () => {}
const onThreadPage = () => {}
const offThreadPage = () => {}

export function mapStateToProps (state, props) {
  return {
    currentUser: getCurrentUser(state),
    thread,
    messages,
    pending: false
  }
}

export const mapDispatchToProps = {
  fetchAfter,
  fetchBefore,
  onThreadPage,
  offThreadPage
}

export default connect(mapStateToProps, mapDispatchToProps)
