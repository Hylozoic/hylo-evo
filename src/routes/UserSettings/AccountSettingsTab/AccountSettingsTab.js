import { trim, pick, keys, omit, find, isEmpty } from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Button from 'components/Button'
import Loading from 'components/Loading'
import SettingsControl from 'components/SettingsControl'
import { validateEmail } from 'util/index'

import './AccountSettingsTab.scss'

import ModalDialog from 'components/ModalDialog'
const { object, func } = PropTypes

export default class AccountSettingsTab extends Component {
  static propTypes = {
    currentUser: object,
    updateUserSettings: func,
    deleteMe: func,
    deactivateMe: func,
    logout: func
  }

  constructor (props) {
    super(props)
    this.state = { edits: {}, changed: {}, showDeleteModal: false, showDeactivateModal: false }
  }

  componentDidMount () {
    this.setEditState()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.fetchPending && !this.props.fetchPending) {
      this.setEditState()
    }
  }

  deactivateMe = () => {
    const { deactivateMe, currentUser, logout } = this.props
    deactivateMe(currentUser.id).then(logout)
  }

  deleteMe = () => {
    const { deleteMe, currentUser, logout } = this.props
    deleteMe(currentUser.id).then(logout)
  }

  setEditState () {
    const { currentUser } = this.props

    if (!currentUser) return

    const initialValues = {
      email: currentUser.email || '',
      password: '',
      confirm: ''
    }

    this.setState({
      initialValues,
      edits: initialValues
    })
  }

  updateSetting = key => event => {
    const newValue = trim(event.target.value)
    const { setConfirm } = this.props
    const { changed, edits } = this.state

    if (newValue === this.state.initialValues[key]) {
      return this.setState({
        changed: omit(key, this.state.changed),
        edits: {
          ...edits,
          [key]: newValue
        }
      })
    }

    setConfirm('You have unsaved changes. Are you sure you want to leave?')
    this.setState({
      changed: {
        ...changed,
        [key]: true
      },
      edits: {
        ...edits,
        [key]: newValue
      }
    })
  }

  hasChanges = () => find(c => c, this.state.changed)

  formErrors = () => {
    const { edits } = this.state
    const { email, password, confirm } = edits
    const hasChanges = this.hasChanges()
    const errors = []

    if (!hasChanges) return errors

    const passwordConfirmed = password === confirm

    if (!validateEmail(email)) errors.push('Email address is not in a valid format')
    if (password.length > 0 && password.length < 9) errors.push('Passwords must be at least 9 characters long')
    if (!passwordConfirmed) errors.push('Passwords don\'t match')

    return errors
  }

  canSave = () => this.hasChanges() && isEmpty(this.formErrors())

  save = () => {
    const { changed, edits } = this.state
    const { updateUserSettings, setConfirm } = this.props

    this.setState({ changed: {} })
    setConfirm(false)
    updateUserSettings(pick(keys(omit('confirm', changed)), edits))
  }

  render () {
    if (!this.props.currentUser) return <Loading />

    const { edits, showDeactivateModal, showDeleteModal } = this.state
    const { email, password, confirm } = edits
    const formErrors = this.formErrors()
    const canSave = this.canSave()

    return <div>
      <div styleName='title'>Update Account</div>
      {formErrors.map((formErrorText, i) =>
        <div styleName='error' key={i}>{formErrorText}</div>)}
      <SettingsControl label='Email' onChange={this.updateSetting('email')} value={email} />
      <SettingsControl label='New Password' onChange={this.updateSetting('password')} value={password} type='password' />
      <SettingsControl label='New Password (Confirm)' onChange={this.updateSetting('confirm')} value={confirm} type='password' />
      <div styleName='help'>
        Passwords must be at least 9 characters long, and should be a mix of lower and upper case letters, numbers and symbols.
      </div>
      <div styleName='button-row'><Button onClick={() => this.setState({ showDeactivateModal: true })} label='Deactivate Account' color={'purple'} /></div>
      <div styleName='button-row'><Button onClick={() => this.setState({ showDeleteModal: true })} label='Delete Account' color={'purple'} /></div>

      <div styleName='saveChanges'>
        <span styleName={canSave ? 'settingChanged' : ''}>{canSave ? 'Changes not saved' : 'Current settings up to date'}</span>
        <Button label='Save Changes' color={canSave ? 'green' : 'gray'} onClick={canSave ? this.save : null} styleName='save-button' />
      </div>
      {showDeactivateModal &&
        <ModalDialog key='deactviate-user-dialog'
          closeModal={() => this.setState({ showDeactivateModal: false })}
          showModalTitle={false}
          submitButtonAction={() => this.deactivateMe()}
          submitButtonText='Confirm' >
          <h2>
            Deactivate
          </h2>
          <p>
            This action is reversible, just log back in
          </p>
          <div styleName='modal-container'>
            <h4>
              If you deactivate your account:
            </h4>
            <ul>
              <li>You won't be able to use Hylo unless you log back in</li>
              <li>You won't receive platform notifications</li>
              <li>Your profile won't show up in any member searches or group memberships</li>
              <li>Your comments and posts will REMAIN as they are</li>
            </ul>
          </div>
        </ModalDialog>
      }
      {showDeleteModal &&
        <ModalDialog key='delete-user-dialog'
          closeModal={() => this.setState({ showDeleteModal: false })}
          showModalTitle={false}
          submitButtonAction={() => this.deleteMe()}
          submitButtonText='Confirm' >
          <h2 style={{ color: 'red' }}>
            DELETE: CAUTION
          </h2>
          <p>
            This action is <strong style={{ color: 'red' }}>NOT</strong> reversible
          </p>
          <div styleName='modal-container'>
            <h4>
              If you delete your account:
            </h4>
            <ul>
              <li>Your account and its details will be deleted</li>
              <li>The content of your posts and comments will be removed</li>
              <li>You won't be able to use Hylo unless you create a brand new account</li>
            </ul>
          </div>
        </ModalDialog>
      }
    </div>
  }
}
