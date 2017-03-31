import React from 'react'
import './Login.scss'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import Icon from 'components/Icon'

export default class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    // FIXME this should go somewhere else -- ideally in a parent route of the
    // login page and the logged-in components
    this.props.checkLogin()
  }

  submit = () => {
    return this.props.login(this.state.email, this.state.password)
  }

  render () {
    const setState = key => event => this.setState({[key]: event.target.value})
    return <div styleName='background'>
      <div styleName='container'>
        <h1 styleName='title'>Log in to Hylo-Evo</h1>
        <p styleName='blurb'>Stay connected, organized, and engaged with your community.</p>
        <div styleName='field'>
          <label styleName='field-label'>Your email address</label>
          <TextInput type='text' name='email'
            onChange={setState('email')}
            defaultValue='foo@bar.com' />
        </div>
        <div styleName='field'>
          <label styleName='field-label'>Password</label>
          <TextInput type='password' name='password' onChange={setState('password')} />
        </div>
        <Button styleName='submit' label='Log In' onClick={this.submit} />
        <p styleName='connect-label'>Or connect with:</p>
        <div styleName='auth-buttons'>
          <a styleName='facebook'>
            <Icon name='Facebook' />
            Facebook
          </a>
          <a styleName='google'>
            <Icon name='Google' />
            Google
            </a>
          <a styleName='linkedin'>
            <Icon name='Linkedin' />
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  }
}
