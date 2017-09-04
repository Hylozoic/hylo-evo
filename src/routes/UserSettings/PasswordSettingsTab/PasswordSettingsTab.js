import React, { PropTypes, Component } from 'react'
import { isEmpty, omit } from 'lodash/fp'
import SettingsControl from 'components/SettingsControl'
import './PasswordSettingsTab.scss'
import Button from 'components/Button'
import Loading from 'components/Loading'
const { object, func } = PropTypes

export default class PasswordSettingsTab extends Component {
  static propTypes = {
    currentUser: object,
    updateUserSettings: func,
    loginWithService: func
  }
  constructor (props) {
    super(props)
    this.state = {edits: {}, changed: false}
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
      setChanged && setConfirm('You have unsaved changes, are you sure you want to leave?')
      this.setState({
        changed: setChanged ? true : changed,
        edits: {
          ...edits,
          [key]: event.target.value
        }
      })
    }

    const save = () => {
      this.setState({changed: false})
      setConfirm(false)
      updateUserSettings(omit('confirm', edits))
    }

    const canSave = !isEmpty(password) && password === confirm && changed

    return <div>
      <div styleName='title'>Update Password</div>
      <SettingsControl label='New Password' onChange={updateSetting('password')} value={password} type='password' />
      <SettingsControl label='Confirm' onChange={updateSetting('confirm')} value={confirm} type='password' />
      <div styleName='button-row'>
        <Button label='Save Changes' color={canSave ? 'green' : 'gray'} onClick={canSave ? save : null} styleName='save-button' />
      </div>
    </div>
  }
}
