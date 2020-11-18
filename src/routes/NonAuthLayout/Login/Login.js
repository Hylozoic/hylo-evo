import React from 'react'
import { Link } from 'react-router-dom'
import { formatError } from '../util'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import DownloadAppModal from 'components/DownloadAppModal'
import FacebookButton from 'components/FacebookButton'
import GoogleButton from 'components/GoogleButton'
import './Login.scss'

export default class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  submit = () => {
    return this.props.login(this.state.email, this.state.password)
      .then(({ error }) => error || this.props.redirectOnSignIn('/'))
  }

  loginAndRedirect = (service) => {
    this.props.loginWithService(service)
      .then(({ error }) => error || this.props.redirectOnSignIn('/'))
  }

  render () {
    const setState = key => event => this.setState({ [key]: event.target.value })
    const { downloadAppUrl, returnToURL } = this.props
    return <div className={this.props.className}>
      {downloadAppUrl && <DownloadAppModal url={downloadAppUrl} returnToURL={returnToURL} />}
      <h1 styleName='title'>Log in to Hylo</h1>
      {this.props.error && formatError(this.props.error, 'Login')}
      <div styleName='field'>
        <label htmlFor='email' styleName='field-label'>Your email address</label>
        <TextInput aria-label='email' label='email' type='text' name='email' onChange={setState('email')}
          inputRef={input => { this.email = input }} autoFocus />
      </div>

      <div styleName='field'>
        <Link to='/reset-password' styleName='forgot-password'>
          <span styleName='forgot-password'>Forgot password?</span>
        </Link>
        <label htmlFor='password' styleName='field-label'>Password</label>
        <TextInput aria-label='password' label='password' type='password' name='password'
          onChange={setState('password')}
          onEnter={this.submit} />
      </div>
      <Button styleName='submit' label='Log In' onClick={this.submit} />
      <p styleName='connect-label'>Or:</p>
      <div styleName='auth-buttons'>
        <FacebookButton onClick={() => this.loginAndRedirect('facebook')} />
        <GoogleButton onClick={() => this.loginAndRedirect('google')} />
      </div>
    </div>
  }
}
