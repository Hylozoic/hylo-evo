import React, { Component } from 'react'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import './PasswordReset.scss'

export default class PasswordReset extends Component {
  constructor (props) {
    super(props)
    this.state = {email: ''}
  }

  componentDidMount () {
    this.email.focus()
  }

  render () {
    const { className } = this.props
    const onChange = value => this.setState({email: value})
    const { email } = this.state

    return <div className={className}>
      <h1 styleName='title'>Reset Your Password</h1>
      <div styleName='subtitle'>
        Enter your email address and we'll send you an email that lets you reset your password
      </div>
      <div styleName='field'>
        <label styleName='field-label'>Your email address</label>
        <TextInput type='text' name='email' onChange={onChange} value={email}
          inputRef={input => { this.email = input }} />
      </div>
      <Button styleName='submit' label='Reset' onClick={this.submit} />
    </div>
  }
}
