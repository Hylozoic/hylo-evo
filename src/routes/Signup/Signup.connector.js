import { connect } from 'react-redux'
import { signup } from './Signup.store'
import { push } from 'react-router-redux'

export const mapDispatchToProps = {signup, navigate: push}

export default connect(null, mapDispatchToProps)
