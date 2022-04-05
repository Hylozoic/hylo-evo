import React, { Component } from 'react'
import validator from 'validator'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import './PasswordReset.scss'

export default class PasswordReset extends Component {
  constructor (props) {
    super(props)
    this.state = { email: '', success: false, error: false }
  }

  componentDidMount () {
    this.email.focus()
  }

  submit () {
    const { email } = this.state
    this.props.sendPasswordReset(email)
      .then(({ error }) => {
        if (error) {
          this.setState({ error })
        } else {
          this.setState({ success: true })
        }
      })
  }

  render () {
    const { className } = this.props
    const onChange = event => this.setState({
      email: event.target.value,
      success: false
    })
    const { email, success, error } = this.state

    const canSubmit = validator.isEmail(email)

    return (
      <div className={className}>
        <div styleName='formWrapper'>
          <h1 styleName='title'>Reset Your Password</h1>
          <div styleName='subtitle'>
            Enter your email address and we'll send you an email that lets you reset your password.
          </div>
          {success && <div styleName='success'>If your email address matched an account in our system, we sent you an email. Please check your inbox.</div>}
          {error && <div styleName='error'>There was a problem with your request. Please check your email and try again.</div>}

          <label>Your email address</label>
          <TextInput
            autoFocus
            inputRef={input => { this.email = input }}
            name='email'
            noClearButton
            onChange={onChange}
            onEnter={() => { this.submit() }}
            styleName='field'
            type='text'
            value={email}
          />

          <Button
            styleName='submit' label='Reset' color={canSubmit ? 'green' : 'gray'}
            onClick={canSubmit ? () => this.submit() : null}
          />
        </div>
      </div>
    )
  }
}
