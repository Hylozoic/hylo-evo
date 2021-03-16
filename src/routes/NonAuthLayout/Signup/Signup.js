import React from 'react'
import { formatError } from '../util'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import DownloadAppModal from 'components/DownloadAppModal'
import FacebookButton from 'components/FacebookButton'
import GoogleButton from 'components/GoogleButton'
import './Signup.scss'
import cx from 'classnames'

export default class Signup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nameActive: false,
      emailActive: false,
      passwordActive: false
    }
  }

  submit = () => {
    this.props.signup(this.state.name, this.state.email, this.state.password)
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
    const { className, downloadAppUrl } = this.props

    return <div className={className}>
      <div styleName='formWrapper'>
        {downloadAppUrl && <DownloadAppModal url={downloadAppUrl} />}
        <h1 styleName='title'>Welcome to Hylo</h1>
        <p styleName='blurb'>Stay connected, organized, and engaged with your group.</p>
        {this.props.error && formatError(this.props.error, 'Signup')}
        <div styleName='field'>
          <label htmlFor='name' styleName={cx('field-label', this.state.nameActive === true ? 'active' : '')}>Full name</label>
          <TextInput aria-label='name' label='name' type='text' name='name' id='name' styleName='authInput'
            onFocus={this.activateField}
            onChange={this.handleChange}
            onBlur={this.disableFocus}
            onAnimationStart={this.handleAnimation}
            inputRef={input => { this.name = input }} />
        </div>
        <div styleName='field'>
          <label htmlFor='email' styleName={cx('field-label', this.state.emailActive === true ? 'active' : '')}>Your email address</label>
          <TextInput aria-label='email' label='email' type='text' name='email' id='email' styleName='authInput'
            onFocus={this.activateField}
            onChange={this.handleChange}
            onBlur={this.disableFocus}
            onAnimationStart={this.handleAnimation}
            inputRef={input => { this.email = input }} />
        </div>
        <div styleName='field'>
          <label htmlFor='password' styleName={cx('field-label', this.state.passwordActive === true ? 'active' : '')}>Password</label>
          <TextInput aria-label='password' label='password' type='password' name='password' id='password' styleName='authInput'
            onFocus={this.activateField}
            onChange={this.handleChange}
            onBlur={this.disableFocus}
            onAnimationStart={this.handleAnimation}
            onEnter={this.submit} />
        </div>
        <Button styleName='submit' label='Sign Up' onClick={this.submit} />
      </div>
      <div styleName='auth-buttons'>
        <FacebookButton signUp onClick={this.submit} />
        <GoogleButton signUp onClick={this.submit} />
      </div>
    </div>
  }
}
