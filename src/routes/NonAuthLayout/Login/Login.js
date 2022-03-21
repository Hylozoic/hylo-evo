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
      error: null,
      password: '',
      passwordActive: false
    }
  }

  // async componentDidMount () {
  //   // Current user data is required to be present for routing
  //   // to switch to auth'd layouts (i.e. PrimaryLayout)
  //   await this.props.checkLogin()
  // }

  submit = async () => {
    const result = await this.props.login(this.state.email, this.state.password)
    const { me, error } = result.payload.data.login

    if (!me || error) {
      this.setState({ error: error || 'Incorrect credentials' })
    }
  }

  loginAndRedirect = async service => {
    const result = await this.props.loginWithService(service)

    if (result?.error) {
      return this.setState({ error: result.error })
    }

    // Current user data is required to be present for routing
    // to switch to auth'd layouts (i.e. PrimaryLayout)
    await this.props.checkLogin()
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: null
    })
  }

  render () {
    const { downloadAppUrl, returnToURL } = this.props
    const { email, password } = this.state
    const error = this.props.error || this.state.error

    return (
      <div className={this.props.className}>
        <div styleName='formWrapper'>
          {downloadAppUrl && <DownloadAppModal url={downloadAppUrl} returnToURL={returnToURL} />}
          <h1 styleName='title'>Sign in to Hylo</h1>
          {error && formatError(error, 'Login')}

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
    )
  }
}
