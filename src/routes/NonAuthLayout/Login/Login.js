import React from 'react'
import { Link } from 'react-router-dom'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import Icon from 'components/Icon'
import { formatError } from '../util'
import './Login.scss'

export default class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  submit = () => {
    return this.props.login(this.state.email, this.state.password)
    .then(({ error }) => error || this.props.navigate('/'))
  }

  loginAndRedirect = (service) => {
    this.props.loginWithService(service)
    .then(({ error }) => error || this.props.navigate('/'))
  }

  googleLogin = () => {
    this.loginAndRedirect('google')
  }

  facebookLogin = () => {
    this.loginAndRedirect('facebook')
  }
  render () {
    const { className, loginWithService } = this.props
    const setState = key => event => this.setState({[key]: event.target.value})
    return <div className={className} role='form' aria-label='Log in with email and password, Facebook, or Google.' tabIndex='0'>
      <h1 styleName='title'>Log in to Hylo</h1>
      {this.props.error && formatError(this.props.error, 'Login')}
      <div styleName='field'>
        <label htmlFor='email' styleName='field-label'>Your email address</label>
        <TextInput label='email' type='text' name='email' onChange={setState('email')}
          inputRef={input => { this.email = input }} autoFocus />
      </div>

      <div styleName='field'>
        <label htmlFor='password' styleName='field-label'>Password</label>
        <TextInput label='password' type='password' name='password'
          onChange={setState('password')}
          onEnter={this.submit} />
      </div>
      <Button styleName='submit' label='Log In' onClick={this.submit} />
      <Link to='/reset-password' styleName='forgot-password'>
        <p styleName='forgot-password'>Forgot password?</p>
      </Link>
      <p styleName='connect-label'>Or connect with:</p>
      <div styleName='auth-buttons'>
        <a styleName='facebook'
          aria-label='Log in with Facebook'
          onClick={this.facebookLogin}
          tabIndex='0'
          role='button'
          onKeyPress={event => {
            if (event.key === 'Enter') {
              this.facebookLogin()
            }
          }}
        >
          <Icon name='Facebook' styleName='auth-icon' />
          Facebook
        </a>
        <a styleName='google'
          aria-label='Log in with Google'
          onClick={this.googleLogin}
          tabIndex='0'
          role='button'
          onKeyPress={event => {
            if (event.key === 'Enter') {
              this.googleLogin()
            }
          }}
        >
          <Icon name='Google' styleName='auth-icon' />
          Google
          </a>
      </div>
    </div>
  }
}
