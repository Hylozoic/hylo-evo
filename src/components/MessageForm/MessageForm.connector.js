import { connect } from 'react-redux'
import getCurrentUser from 'store/selectors/getCurrentUser'
import { createComment } from 'store/actions'

export function mapStateToProps (state) {
  return {
    currentUser: getCurrentUser(state)
  }
}

export const mapDispatchToProps = { createComment }
export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
