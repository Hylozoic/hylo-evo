import { connect } from 'react-redux'
import { fetchCurrentUser } from 'routes/PrimaryLayout/actions'
import { getMe } from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state.orm)
  }
}

export const mapDispatchToProps = {
  fetchCurrentUser
}

export default connect(mapStateToProps, mapDispatchToProps)
