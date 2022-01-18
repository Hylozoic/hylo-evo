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

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render () {
    const { downloadAppUrl, returnToURL } = this.props
    const { email, password } = this.state

    return <div className={this.props.className}>
      <div styleName='formWrapper'>
        {downloadAppUrl && <DownloadAppModal url={downloadAppUrl} returnToURL={returnToURL} />}
        <h1 styleName='title'>Sign in to Hylo</h1>
        {this.props.error && formatError(this.props.error, 'Login')}

        <TextInput
          aria-label='email' label='email' name='email' id='email'
          autoFocus
          internalLabel='Email'
          onChange={this.handleChange}
          styleName='field'
          type='email'
          value={email}
        />

        <TextInput
          aria-label='password' label='password' name='password' id='password'
          internalLabel='Password'
          onChange={this.handleChange}
          onEnter={this.submit}
          styleName='field'
          type='password'
          value={password}
        />
        <Link to='/reset-password' styleName='forgot-password'>
          <span styleName='forgot-password'>Forgot password?</span>
        </Link>

        <Button styleName='submit' label='Sign in' onClick={this.submit} />
      </div>
      <div styleName='auth-buttons'>
        <FacebookButton onClick={() => this.loginAndRedirect('facebook')} />
        <GoogleButton onClick={() => this.loginAndRedirect('google')} />
      </div>
    </div>
  }
}
