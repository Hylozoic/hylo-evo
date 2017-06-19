import { goBack, push } from 'react-router-redux'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

function mapDispatchToProps (dispatch, props) {
  return {
    goBack: () =>
      dispatch(props.history.length > 2 ? goBack() : push('/'))
  }
}

export default component =>
  withRouter(connect(null, mapDispatchToProps)(component))
