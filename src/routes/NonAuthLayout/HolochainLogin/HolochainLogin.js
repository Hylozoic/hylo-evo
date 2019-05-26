import React from 'react'
import PropTypes from 'prop-types'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import { communityUrl } from 'util/navigation'
import { get } from 'lodash/fp'
import { formatError } from '../util'
import './HolochainLogin.scss'

export default class HolochainLogin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  submit = async () => {
    const { registerHolochainAgent, createDefaultCommunity, redirectOnSignIn, setLogin } = this.props

    await registerHolochainAgent(this.state.name, this.state.avatarUrl)

    const defaultCommunityPayload = await createDefaultCommunity()
    const defaultCommunitySlug = get('data.createCommunity.slug', defaultCommunityPayload)

    setLogin(true)
    redirectOnSignIn(communityUrl(defaultCommunitySlug, '/'))
  }

  onChangeHandlerForKey = key => event => this.setState({ [key]: event.target.value })

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
        <label htmlFor='avatarUrl' styleName='field-label'>Avatar URL</label>
        <TextInput aria-label='avatarUrl' label='avatarUrl' type='text' name='avatarUrl' onChange={this.onChangeHandlerForKey('avatarUrl')}
          inputRef={input => { this.avatarUrl = input }} />
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
