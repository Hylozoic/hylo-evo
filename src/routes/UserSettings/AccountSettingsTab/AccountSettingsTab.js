import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { trim, pick, keys, omit, find, isEmpty } from 'lodash/fp'
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
    this.state = { edits: {}, changed: {} }
  }

  componentDidMount () {
    this.setEditState()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.fetchPending && !this.props.fetchPending) {
      this.setEditState()
    }
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
    if (!passwordConfirmed && confirm.length > 8) errors.push('Passwords don\'t match')

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

    const { edits } = this.state
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

      <div styleName='saveChanges'>
        <span styleName={canSave ? 'settingChanged' : ''}>{canSave ? 'Changes not saved' : 'Current settings up to date'}</span>
        <Button label='Save Changes' color={canSave ? 'green' : 'gray'} onClick={canSave ? this.save : null} styleName='save-button' />
      </div>
    </div>
  }
}

/* eslint-disable */
export const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email.toLowerCase())
}
