import { connect } from 'react-redux'
import { fetchCurrentUser } from 'routes/PrimaryLayout/PrimaryLayout.store'
import { getMe } from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state)
  }
}

export const mapDispatchToProps = {
  fetchCurrentUser
}

export default connect(mapStateToProps, mapDispatchToProps)
