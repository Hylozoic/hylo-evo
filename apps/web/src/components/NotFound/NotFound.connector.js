import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'

function mapDispatchToProps (dispatch, props) {
  const navigate = useNavigate()
  // TODO: hmm, how to do
  return {
    goBack: () =>
      dispatch(props.history.length > 2 ? navigate(-1) : navigate('/'))
  }
}

export default component => connect(null, mapDispatchToProps)(component)
