import { connect } from 'react-redux'
import { updateWidget } from './Widget.store'

export function mapStateToProps (state, props) {
  return {
    ...props
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    updateWidget: (id, changes) => dispatch(updateWidget(id, changes))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
