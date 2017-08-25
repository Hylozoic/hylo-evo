import React from 'react'
import { uniq } from 'lodash'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import Icon from 'components/Icon'
import './Signup.scss'

export default class Signup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  submit = () => {
    this.props.signup(this.state.fullName, this.state.email, this.state.password)
  }

  componentDidMount () {
    this.email.focus()
  }

  render () {
    const { className } = this.props
    const setState = key => event => this.setState({[key]: event.target.value})
    return <div className={className}>
      <h1 styleName='title'>Welcome to Hylo</h1>
      <p styleName='blurb'>Stay connected, organized, and engaged with your community.</p>
      {this.props.error && formatError(this.props.error)}
      <div styleName='field'>
        <label styleName='field-label'>Full name</label>
        <TextInput type='text' name='fullName' onChange={setState('fullName')}
          inputRef={input => { this.fullName = input }} />
      </div>
      <div styleName='field'>
        <label styleName='field-label'>Your email address</label>
        <TextInput type='text' name='email' onChange={setState('email')}
          inputRef={input => { this.email = input }} />
      </div>
      <div styleName='field'>
        <label styleName='field-label'>Password</label>
        <TextInput type='password' name='password'
          onChange={setState('password')}
          onEnter={this.submit} />
      </div>
      <Button styleName='submit' label='Sign Up' onClick={this.submit} />
      <p styleName='connect-label'>Or connect with:</p>
      <div styleName='auth-buttons'>
        <a styleName='facebook' onClick={this.submit}>
          <Icon name='Facebook' styleName='auth-icon' />
          Facebook
        </a>
        <a styleName='google' onClick={this.submit}>
          <Icon name='Google' styleName='auth-icon' />
          Google
        </a>
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
      text = 'Signup was canceled or no user data was found.'
      break
    case 'no email':
      text = 'The user data did not include an email address.'
      break
    default:
      text = error
  }

  return <div styleName='error'>{text}</div>
}
