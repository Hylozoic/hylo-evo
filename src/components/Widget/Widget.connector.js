import { connect } from 'react-redux'
import { toggleWidgetVisibility } from './Widget.store'

export function mapStateToProps (state, props) {
  return {
    isVisible: props.isVisible
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    toggleVisibility: (params) => {
      dispatch(toggleWidgetVisibility(params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)