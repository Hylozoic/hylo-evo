import { connect } from 'react-redux'
// import { someAction } from 'some/path/to/actions'
import { getMe } from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state.orm)
  }
}

export const mapDispatchToProps = {
  // someAction
}

export default connect(mapStateToProps, mapDispatchToProps)
