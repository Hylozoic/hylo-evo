import { connect } from 'react-redux'
import { push } from 'react-router-redux'

export const mapDispatchToProps = (dispatch, props) => {
  return {
    newPost: () => dispatch(push('p/new'))
  }
}

export default connect(null, mapDispatchToProps)
