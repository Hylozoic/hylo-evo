import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'
import { createComment } from 'store/actions'

export function mapStateToProps (state) {
  return {
    currentUser: getMe(state.orm)
  }
}

export const mapDispatchToProps = { createComment }
export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
