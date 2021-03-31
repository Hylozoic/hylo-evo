import React from 'react'
import { Link } from 'react-router-dom'
import { formatError } from '../util'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import DownloadAppModal from 'components/DownloadAppModal'
import FacebookButton from 'components/FacebookButton'
import GoogleButton from 'components/GoogleButton'
import './Login.scss'
import cx from 'classnames'

export default class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      emailActive: false,
      password: '',
      passwordActive: false
    }
  }

  submit = () => {
    return this.props.login(this.state.email, this.state.password)
      .then(({ error }) => error || this.props.redirectOnSignIn('/'))
  }

  loginAndRedirect = (service) => {
    this.props.loginWithService(service)
      .then(({ error }) => error || this.props.redirectOnSignIn('/'))
  }

  activateField = (e) => {
    this.setState({
      [`${e.target.name}Active`]: true
    })
  }

  disableField = (e) => {
    this.setState({
      [`${e.target.name}Active`]: false
    })
  }

  disableFocus = (e) => {
    if (e.target.value === '') {
      this.disableField(e)
    } else {
      this.activateField(e)
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
    if (e.target.value === '') {
      this.disableField(e)
    } else {
      this.activateField(e)
    }
  }

  handleAnimation = (e) => {
    this.setState({
      [`${e.target.name}Active`]: e.animationName === 'onAutoFillStart'
    })
  }

  render () {
    const { downloadAppUrl, returnToURL } = this.props
    return <div className={this.props.className}>
      <div styleName='formWrapper'>
        {downloadAppUrl && <DownloadAppModal url={downloadAppUrl} returnToURL={returnToURL} />}
        <h1 styleName='title'>Sign in to Hylo</h1>
        {this.props.error && formatError(this.props.error, 'Login')}
        <div styleName='field'>
          <label htmlFor='email' styleName={cx('field-label', this.state.emailActive || this.state.email.length > 0 ? 'active' : '')}>Your email address</label>
          <TextInput aria-label='email' label='email' type='text' name='email' id='email' styleName='authInput'
            onFocus={this.activateField}
            onChange={this.handleChange}
            onBlur={this.disableFocus}
            onAnimationStart={this.handleAnimation}
            inputRef={input => { this.email = input }} />
        </div>

        <div styleName='field'>
          <label htmlFor='password' styleName={cx('field-label', this.state.passwordActive || this.state.password.length > 0 ? 'active' : '')}>Password</label>
          <TextInput aria-label='password' label='password' type='password' name='password' id='password' styleName='authInput'
            onFocus={this.activateField}
            onChange={this.handleChange}
            onBlur={this.disableFocus}
            onAnimationStart={this.handleAnimation}
            onEnter={this.submit} />
          <Link to='/reset-password' styleName='forgot-password'>
            <span styleName='forgot-password'>Forgot password?</span>
          </Link>
        </div>
        <Button styleName='submit' label='Sign in' onClick={this.submit} />
      </div>
      <div styleName='auth-buttons'>
        <FacebookButton onClick={() => this.loginAndRedirect('facebook')} />
        <GoogleButton onClick={() => this.loginAndRedirect('google')} />
      </div>
    </div>
  }
}
