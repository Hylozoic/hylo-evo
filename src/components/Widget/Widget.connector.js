import { connect } from 'react-redux'
import { toggleWidgetVisibility } from './Widget.store'

export function mapDispatchToProps (dispatch) {
  return {
    toggleVisibility: (params) => dispatch(toggleWidgetVisibility(params)),
  }
}

export default connect(mapDispatchToProps)