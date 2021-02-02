import React from 'react'
import { formatError } from '../util'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import DownloadAppModal from 'components/DownloadAppModal'
import FacebookButton from 'components/FacebookButton'
import GoogleButton from 'components/GoogleButton'
import './Signup.scss'

export default class Signup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  submit = () => {
    this.props.signup(this.state.name, this.state.email, this.state.password)
  }

  render () {
    const { className, downloadAppUrl } = this.props
    const setState = key => event => this.setState({ [key]: event.target.value })

    return <div className={className}>
      {downloadAppUrl && <DownloadAppModal url={downloadAppUrl} />}
      <h1 styleName='title'>Welcome to Hylo</h1>
      <p styleName='blurb'>Stay connected, organized, and engaged with your group.</p>
      {this.props.error && formatError(this.props.error, 'Signup')}
      <div styleName='field'>
        <label htmlFor='name' styleName='field-label'>Full name</label>
        <TextInput aria-label='name' label='name' type='text' name='name' onChange={setState('name')}
          inputRef={input => { this.name = input }} autoFocus />
      </div>
      <div styleName='field'>
        <label htmlFor='email' styleName='field-label'>Your email address</label>
        <TextInput aria-label='email' label='email' type='text' name='email' onChange={setState('email')}
          inputRef={input => { this.email = input }} />
      </div>
      <div styleName='field'>
        <label htmlFor='password' styleName='field-label'>Password</label>
        <TextInput aria-label='password' label='password' type='password' name='password'
          onChange={setState('password')}
          onEnter={this.submit} />
      </div>
      <Button styleName='submit' label='Sign Up' onClick={this.submit} />
      <p styleName='connect-label'>Or:</p>
      <div styleName='auth-buttons'>
        <FacebookButton signUp onClick={this.submit} />
        <GoogleButton signUp onClick={this.submit} />
      </div>
    </div>
  }
}
