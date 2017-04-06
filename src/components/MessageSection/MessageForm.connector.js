import { connect } from 'react-redux'
import getCurrentUser from 'store/selectors/getCurrentUser'

export function mapStateToProps (state) {
  return {
    currentUser: getCurrentUser(state)
  }
}

export const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
