import React from 'react'
import './Login.scss'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import Icon from 'components/Icon'
import { uniq } from 'lodash'

export default class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  submit = () => {
    return this.props.login(this.state.email, this.state.password)
  }

  render () {
    const setState = key => event => this.setState({[key]: event.target.value})
    const { loginWithService } = this.props
    return <div styleName='background'>
      <div styleName='container'>
        <h1 styleName='title'>Log in to Hylo-Evo</h1>
        <p styleName='blurb'>Stay connected, organized, and engaged with your community.</p>

        {this.props.error && formatError(this.props.error)}

        <div styleName='field'>
          <label styleName='field-label'>Your email address</label>
          <TextInput type='text' name='email' onChange={setState('email')} />
        </div>

        <div styleName='field'>
          <label styleName='field-label'>Password</label>
          <TextInput type='password' name='password'
            onChange={setState('password')}
            onEnter={this.submit} />
        </div>
        <Button styleName='submit' label='Log In' onClick={this.submit} />

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
          <a styleName='linkedin' onClick={() => loginWithService('linkedin')}>
            <Icon name='LinkedIn' styleName='auth-icon' />
            LinkedIn
          </a>
        </div>
      </div>
      <div styleName='below-container'>
        <a onClick={() => this.props.navigate('/ui-kit')}>UI Kit</a>
      </div>
    </div>
  }
}

function formatError (error) {
  if (!error) return

  const noPasswordMatch = error.match(/password account not found. available: \[(.*)\]/)
  if (noPasswordMatch) {
    var options = uniq(noPasswordMatch[1].split(',')
    .map(option => ({
      'google': 'Google',
      'google-token': 'Google',
      'facebook': 'Facebook',
      'facebook-token': 'Facebook',
      'linkedin': 'LinkedIn',
      'linkedin-token': 'LinkedIn'
    }[option])))

    return <div styleName='error'>
      Your account has no password set. <a href='/set-password'>Set your password here.</a>
      {options[0] && <span><br />Or log in with {options.join(' or ')}.</span>}
    </div>
  }

  var text
  switch (error) {
    case 'no user':
      text = 'Login was canceled or no user data was found.'
      break
    case 'no email':
      text = 'The user data did not include an email address.'
      break
    default:
      text = error
  }

  return <div styleName='error'>{text}</div>
}
