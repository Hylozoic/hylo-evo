import { trim, pick, keys, omit, find, isEmpty } from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import cx from 'classnames'

import Button from 'components/Button'
import Loading from 'components/Loading'
import SettingsControl from 'components/SettingsControl'
import { validateEmail } from 'util/index'

import classes from './AccountSettingsTab.module.scss'

import ModalDialog from 'components/ModalDialog'
const { object, func } = PropTypes

class AccountSettingsTab extends Component {
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

    setConfirm(this.props.t('You have unsaved changes, are you sure you want to leave?'))
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
    const { t } = this.props
    const { edits } = this.state
    const { email, password, confirm } = edits
    const hasChanges = this.hasChanges()
    const errors = []

    if (!hasChanges) return errors

    const passwordConfirmed = password === confirm

    if (!validateEmail(email)) errors.push(t('Email address is not in a valid format'))
    if (password.length > 0 && password.length < 9) errors.push(t('Passwords must be at least 9 characters long'))
    if (!passwordConfirmed) errors.push(t('Passwords don\'t match'))

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
    const { t } = this.props
    const { email, password, confirm } = edits
    const formErrors = this.formErrors()
    const canSave = this.canSave()

    return (
      <div>
        <div className={classes.title}>{t('Update Account')}</div>
        {formErrors.map((formErrorText, i) =>
          <div className={classes.error} key={i}>{formErrorText}</div>)}
        <SettingsControl label={t('Email')} onChange={this.updateSetting('email')} value={email} />
        <SettingsControl label={t('New Password')} onChange={this.updateSetting('password')} value={password} type='password' />
        <SettingsControl label={t('New Password (Confirm)')} onChange={this.updateSetting('confirm')} value={confirm} type='password' />
        <div className={classes.help}>
          {t('Passwords must be at least 9 characters long, and should be a mix of lower and upper case letters, numbers and symbols.')}
        </div>
        <div className={classes.buttonRow}><Button onClick={() => this.setState({ showDeactivateModal: true })} label={t('Deactivate Account')} color='purple' /></div>
        <div className={classes.buttonRow}><Button onClick={() => this.setState({ showDeleteModal: true })} label={t('Delete Account')} color='purple' /></div>

        <div className={classes.saveChanges}>
          <span className={cx({ [classes.settingChanged]: canSave })}>{canSave ? 'Changes not saved' : 'Current settings up to date'}</span>
          <Button label={t('Save Changes')} color={canSave ? 'green' : 'gray'} onClick={canSave ? this.save : null} className={classes.saveButton} />
        </div>
        {showDeactivateModal &&
          <ModalDialog key='deactviate-user-dialog'
            closeModal={() => this.setState({ showDeactivateModal: false })}
            showModalTitle={false}
            submitButtonAction={() => this.deactivateMe()}
            submitButtonText='Confirm' >
            <h2>
              {t('Deactivate')}
            </h2>
            <p>
              {t('This action is reversible, just log back in')}
            </p>
            <div className={classes.modalContainer}>
              <h4>
                {t('If you deactivate your account:')}
              </h4>
              <ul>
                <li>{t('You won\'t be able to use Hylo unless you log back in')}</li>
                <li>{t('You won\'t receive platform notifications')}</li>
                <li>{t('Your profile won\'t show up in any member searches or group memberships')}</li>
                <li>{t('Your comments and posts will REMAIN as they are')}</li>
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
              {t('DELETE: CAUTION')}
            </h2>
            <p>
              {t('This action is')}{' '}<strong style={{ color: 'red' }}>{t('NOT')}</strong>{' '}{t('reversible')}
            </p>
            <div className={classes.modalContainer}>
              <h4>
                {t('If you delete your account:')}
              </h4>
              <ul>
                <li>{t('Your account and its details will be deleted')}</li>
                <li>{t('The content of your posts and comments will be removed')}</li>
                <li>{t('You won\'t be able to use Hylo unless you create a brand new account')}</li>
              </ul>
            </div>
          </ModalDialog>}
      </div>
    )
  }
}
export default withTranslation()(AccountSettingsTab)
