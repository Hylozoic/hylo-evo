import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { updateWidget } from './Widget.store'

export function mapStateToProps (state, props) {
  return {
    ...props,
    currentUser: getMe(state, props)
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    updateWidget: (id, changes) => dispatch(updateWidget(id, changes))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
