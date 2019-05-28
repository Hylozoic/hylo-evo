import React from 'react'
import PropTypes from 'prop-types'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import { defaultHolochainCommunityUrl } from 'util/navigation'
import { formatError } from '../util'
import fetch from 'isomorphic-fetch'
import './HolochainLogin.scss'
import Avatar from 'components/Avatar/Avatar';

export default class HolochainLogin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  submit = async () => {
    const { registerHolochainAgent, createDefaultCommunity, redirectOnSignIn, setLogin } = this.props

    await registerHolochainAgent(this.state.name, this.state.avatarUrl)
    await createDefaultCommunity()
    setLogin(true)
    redirectOnSignIn(defaultHolochainCommunityUrl())
  }

  onChangeHandlerForKey = key => event => this.setState({ [key]: event.target.value })

  getRandomAvatarUrl = async () => {    
    const randomUserResponse = await fetch('https://randomuser.me/api')
    const randomUserResult = await randomUserResponse.json()
    const randomUser = randomUserResult.results[0]

    this.setState(() => ({ avatarUrl: randomUser.picture.thumbnail }))
    this.avatarUrl.value = randomUser.picture.thumbnail
  }

  render () {
    return <div className={this.props.className}>
      <h1 styleName='title'>Register your Holochain agent</h1>
      {this.props.error && formatError(this.props.error, 'Login')}
      <div styleName='field'>
        <label htmlFor='name' styleName='field-label'>Your name</label>
        <TextInput aria-label='name' label='name' type='text' name='name' onChange={this.onChangeHandlerForKey('name')}
          inputRef={input => { this.name = input }} autoFocus />
      </div>
      <div styleName='field'>
        <label styleName='field-label avatar-entry-label' htmlFor='avatarUrl'>
          Avatar URL
          <a styleName='avatar-entry-label-link' onClick={this.getRandomAvatarUrl}>get random avatar</a>
        </label>
        <div styleName='avatar-entry'>
          <Avatar
            styleName='avatar-entry-preview'
            avatarUrl={this.state.avatarUrl}
          />
          <TextInput
            styleName='avatar-entry-url'
            aria-label='avatarUrl'
            label='avatarUrl'
            type='text'
            name='avatarUrl'
            onChange={this.onChangeHandlerForKey('avatarUrl')}
            inputRef={input => { this.avatarUrl = input }}
          />
        </div>
      </div>
      <Button styleName='submit' label='Log In' onClick={this.submit} />
    </div>
  }
}

HolochainLogin.propTypes = {
  className: PropTypes.string,
  createDefaultCommunity: PropTypes.func,
  error: PropTypes.string,
  redirectOnSignIn: PropTypes.func,
  registerHolochainAgent: PropTypes.func,
  setLogin: PropTypes.func
}
