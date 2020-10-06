import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { omit, isEmpty } from 'lodash/fp'
import SettingsControl from 'components/SettingsControl'
import './AccountSettingsTab.scss'
import Button from 'components/Button'
import Loading from 'components/Loading'
const { object, func } = PropTypes

export default class AccountSettingsTab extends Component {
  static propTypes = {
    currentUser: object,
    updateUserSettings: func,
    loginWithService: func
  }
  constructor (props) {
    super(props)
    this.state = { edits: {}, changed: false }
  }

  render () {
    const {
      currentUser,
      updateUserSettings,
      setConfirm
    } = this.props
    if (!currentUser) return <Loading />

    const { edits, changed } = this.state
    const {
      password, confirm
    } = edits

    const updateSetting = (key, setChanged = true) => event => {
      setChanged && setConfirm('You have unsaved changes. Are you sure you want to leave?')
      this.setState({
        changed: setChanged ? true : changed,
        edits: {
          ...edits,
          [key]: event.target.value
        }
      })
    }

    const save = () => {
      this.setState({ changed: false })
      setConfirm(false)
      updateUserSettings(omit('confirm', edits))
    }

    const matching = password === confirm

    const canSave = password &&
      password.length > 8 &&
      matching &&
      changed

    const matchError = !isEmpty(password) && !matching

    return <div>
      <div styleName='title'>Update Password</div>
      <SettingsControl label='New Password' onChange={updateSetting('password')} value={password} type='password' />
      <SettingsControl label='Confirm' onChange={updateSetting('confirm')} value={confirm} type='password' />
      <div styleName='help'>
        Passwords must be at least 9 characters long, and should be a mix of lower and upper case letters, numbers and symbols.
      </div>
      {matchError && <div styleName='error'>
        Passwords don't match
      </div>}
      <div styleName='button-row'>
        <Button label='Save Changes' color={canSave ? 'green' : 'gray'} onClick={canSave ? save : null} styleName='save-button' />
      </div>
    </div>
  }
}
