import { connect } from 'react-redux'
import { signup } from './Signup.store'
import { push } from 'react-router-redux'

export function mapStateToProps (state, props) {
  return {
    signup,
    navigation: push
  }
}

export default connect(mapStateToProps)
