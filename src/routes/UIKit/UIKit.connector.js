import { connect } from 'react-redux'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'

export const mapDispatchToProps = {
  fetchCurrentUser
}

export default connect(null, mapDispatchToProps)
