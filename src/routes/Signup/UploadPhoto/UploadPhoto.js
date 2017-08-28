import React, { Component } from 'react'
import Button from 'components/Button'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { avatarUploadSettings } from 'store/models/Me'
import ChangeImageButton from 'components/ChangeImageButton'

import { cameraSvg } from 'util/assets'
import LeftSidebar from '../LeftSidebar'
import Loading from 'components/Loading'
import { bgImageStyle } from 'util/index'
import '../Signup.scss'

export default class UploadPhoto extends Component {
  constructor () {
    super()
    this.state = {
      fireRedirect: false
    }
    this.redirectUrl = '/'
  }

  redirect = () => {
    this.setState({
      fireRedirect: true
    })
  }

  updateSetting = (key, setChanged = true) => event => {
    const { edits, changed } = this.state
    setChanged && setConfirm('You have unsaved changes, are you sure you want to leave?')
    this.setState({
      changed: setChanged ? true : changed,
      edits: {
        ...edits,
        [key]: event.target.value
      }
    })
  }

  updateSettingDirectly = (key, changed) => value =>
    this.updateSetting(key, changed)({target: {value}})

  render () {
    const { currentUser } = this.props
    const { fireRedirect } = this.state

    if (!currentUser) return <Loading />
    if (fireRedirect) return <Redirect to={this.redirectUrl} />
    return <div styleName='wrapper'>
      <LeftSidebar
        header="Let's complete your profile!"
        body="Welcome to Hylo, NAME. It only takes a couple seconds to complete your profile. Let's get started!"
      />
      <div styleName='detail'>
        <span styleName='white-text step-count'>STEP 1/4</span>
        <br />
        <div styleName='image-upload-icon'>
          <ChangeImageButton
            update={this.updateSettingDirectly('avatarUrl')}
            uploadSettings={avatarUploadSettings(currentUser)}
            styleName='change-avatar-button'
            child={uploadImageIcon(cameraSvg)}
          />
        </div>
        <div styleName='center center-vertical'>
          <input
            styleName='create-community-input'
            onChange={this.handleCommunityNameChange}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                this.redirect()
              }
            }}
          />
        </div>
        <div>
          <div styleName='float-right bottom'>
            <div>
              <Link to={'/signup/create-community'}>
                <Button styleName='continue-button' label='Onwards!' />
              </Link>
            </div>
            <div styleName='instruction'>or press Enter</div>
          </div>
        </div>
      </div>
    </div>
  }
}

export function uploadImageIcon () {
  return <div styleName='image-upload-icon'>
    <div style={bgImageStyle(cameraSvg)} styleName='camera-svg' />
  </div>
}
