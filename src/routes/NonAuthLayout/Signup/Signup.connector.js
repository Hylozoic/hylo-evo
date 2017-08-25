import { connect } from 'react-redux'
import pickLoginError from 'store/selectors/pickLoginError'
import { signup } from './Signup.store'
import { push } from 'react-router-redux'

export const mapDispatchToProps = {signup, navigate: push}

export default connect(pickLoginError, mapDispatchToProps)

// import { connect } from 'react-redux'
// import { push } from 'react-router-redux'
// import pickLoginError from 'store/selectors/pickLoginError'
// import { signup } from './Signup.store'
// import { checkLogin, login, loginWithService } from './Login.store'
//
// export const mapDispatchToProps = {
//   signup,
//   checkLogin,
//   login,
//   loginWithService,
//   navigate: push
// }
//
// export default connect(pickLoginError, mapDispatchToProps)
