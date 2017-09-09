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
  }

  render () {
    const { className, loginWithService } = this.props
    const setState = key => event => this.setState({[key]: event.target.value})
    return <div className={className}>
      <h1 styleName='title'>Log in to Hylo-Evo</h1>
      {this.props.error && formatError(this.props.error, 'Login')}
      <div styleName='field'>
        <label styleName='field-label'>Your email address</label>
        <TextInput type='text' name='email' onChange={setState('email')}
          inputRef={input => { this.email = input }} autoFocus />
      </div>

      <div styleName='field'>
        <label styleName='field-label'>Password</label>
        <TextInput type='password' name='password'
          onChange={setState('password')}
          onEnter={this.submit} />
      </div>
      <Button styleName='submit' label='Log In' onClick={this.submit} />
      <Link to='/reset-password' styleName='forgot-password'>
        <p styleName='forgot-password'>Forgot password?</p>
      </Link>
      <p styleName='connect-label'>Or connect with:</p>
      <div styleName='auth-buttons'>
        <a styleName='facebook' onClick={() => loginWithService('facebook')}>
          <Icon name='Facebook' styleName='auth-icon' />
          Facebook
        </a>
        <a styleName='google' onClick={() => loginWithService('google')}>
          <Icon name='Google' styleName='auth-icon' />
          Google
          </a>
      </div>
    </div>
  }
}
