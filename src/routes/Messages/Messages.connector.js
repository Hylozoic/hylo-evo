import { connect } from 'react-redux'
import getPreviousLocation from 'store/selectors/getPreviousLocation'

export function mapStateToProps (state, props) {
  return {
    onCloseURL: getPreviousLocation(state)
  }
}

export default connect(mapStateToProps)
