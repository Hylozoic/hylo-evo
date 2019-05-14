import React from 'react'
import TextInput from 'components/TextInput'
import Button from 'components/Button'

import { formatError } from '../util'
import './HolochainLogin.scss'

export default class HolochainLogin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  submit = () => {
    const { registerHolochainAgent, redirectOnSignIn, setLogin } = this.props
    return registerHolochainAgent(this.state.name, this.state.avatarUrl)
      .then(result => {
        console.log('registerHolochainAgent', result)
        setLogin(true)
        redirectOnSignIn('/')
      })
  }

  render () {
    const setState = key => event => this.setState({ [key]: event.target.value })
    return <div className={this.props.className}>
      <h1 styleName='title'>Log in to Hylo</h1>
      {this.props.error && formatError(this.props.error, 'Login')}
      <div styleName='field'>
        <label htmlFor='name' styleName='field-label'>Your name</label>
        <TextInput aria-label='name' label='name' type='text' name='name' onChange={setState('name')}
          inputRef={input => { this.name = input }} autoFocus />
      </div>
      <div styleName='field'>
        <label htmlFor='avatarUrl' styleName='field-label'>Avatar URL</label>
        <TextInput aria-label='avatarUrl' label='avatarUrl' type='text' name='avatarUrl' onChange={setState('avatarUrl')}
          inputRef={input => { this.avatarUrl = input }} autoFocus />
      </div>
      <Button styleName='submit' label='Log In' onClick={this.submit} />
    </div>
  }
}
