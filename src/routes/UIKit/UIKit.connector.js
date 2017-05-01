import { connect } from 'react-redux'
import fetchCurrentUser from 'routes/PrimaryLayout/PrimaryLayout.store'

export const mapDispatchToProps = {
  fetchCurrentUser
}

export default connect(null, mapDispatchToProps)
