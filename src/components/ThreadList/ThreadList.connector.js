import { connect } from 'react-redux'
// import { someAction } from 'some/path/to/actions'
import getCurrentUser from 'store/selectors/getCurrentUser'

export function mapStateToProps (state, props) {
  return {
    currentUser: getCurrentUser(state)
  }
}

export const mapDispatchToProps = {
  // someAction
}

export default connect(mapStateToProps, mapDispatchToProps)
