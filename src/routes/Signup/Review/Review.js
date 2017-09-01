import React, { Component } from 'react'
import LeftSidebar from '../LeftSidebar'
import { bgImageStyle } from 'util/index'
import { avatarUploadSettings } from 'store/models/Me'
import ChangeImageButton from 'components/ChangeImageButton'
import SignupModalFooter from '../SignupModalFooter'
import { cameraSvg, loadingSvg } from 'util/assets'

import '../Signup.scss'

export default class AddLocation extends Component {
  constructor () {
    super()
    this.state = {
      edits: {
        name: null,
        email: null,
        password: null,
        location: null
      },
      readOnly: {
        name: true,
        email: true,
        password: true,
        location: true
      }
    }
  }
  handleInputChange = (event, name) => {
    const value = event.target.value
    this.setState({
      edits: {
        ...this.state.edits,
        [name]: value
      }
    })
  }

  makeEditable = (event, name) => {
    this.setState({
      readOnly: {
        ...this.state.edits,
        [name]: false
      }
    })
  }
  submit = () => {
    const location = this.state.location
    this.props.updateUserSettings({location})
    this.props.goToNextStep()
  }

  previous = () => {
    this.props.goToPreviousStep()
  }

  updateSettingDirectly = (key, setChanged) => value => {
    const { edits, changed } = this.state
    // setChanged && setConfirm('You have unsaved changes, are you sure you want to leave?')
    this.setState({
      changed: setChanged ? true : changed,
      edits: {
        ...edits,
        [key]: value
      }
    })
  }

  componentWillMount = () => {
    const { currentUser } = this.props
    if (currentUser && currentUser.settings.signupInProgress === 'false') this.props.goBack()
  }

  render () {
    const currentAvatarUrl = this.state.edits.avatarUrl

    const { currentUser, uploadImagePending } = this.props
    return <div styleName='wrapper'>
      <LeftSidebar
        header='Everything looking good?'
        body='You can always come back and change your details at any time.'
      />
      <div styleName='detail'>
        <span styleName='white-text step-count'>STEP 4/4</span>
        <br />
        <div styleName='center'>
          <UploadSection
            avatarUrl={currentAvatarUrl}
            updateSettingDirectly={this.updateSettingDirectly}
            currentUser={currentUser}
            loading={uploadImagePending}
          />
        </div>
        <div styleName='three-column-input'>
          <div styleName='column-left'>YOUR NAME</div>
          <div styleName='column-center'>
            <input
              styleName='signup-input'
              onChange={(e) => this.handleInputChange(e, 'name')}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.submit()
                  this.props.goToNextStep()
                }
              }}
              autoFocus
              value={this.state.edits.name || currentUser && currentUser.name}
              readOnly={this.state.readOnly.name}
            />
          </div>
          <div styleName='column-right'>
            <span styleName='edit-button' onClick={() => this.makeEditable('name')}>Edit</span>
          </div>
        </div>
        <div styleName='three-column-input'>
          <div styleName='column-left'>YOUR EMAIL</div>
          <div styleName='column-center'>
            <input
              styleName='signup-input'
              onChange={(e) => this.handleInputChange(e, 'email')}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.submit()
                  this.props.goToNextStep()
                }
              }}
              autoFocus
              value={this.state.edits.email || currentUser && currentUser.name}
              readOnly={this.state.readOnly.name}
            />
          </div>
          <div styleName='column-right'>
            <span styleName='edit-button' onClick={() => this.makeEditable('email')}>Edit</span>
          </div>
        </div>
        <div styleName='three-column-input'>
          <div styleName='column-left'>YOUR PASSWORD</div>
          <div styleName='column-center'>
            <input
              styleName='signup-input'
              onChange={(e) => this.handleInputChange(e, 'password')}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.submit()
                  this.props.goToNextStep()
                }
              }}
              autoFocus
              value={this.state.edits.password || currentUser && currentUser.name}
            />
          </div>
          <div styleName='column-right'>
            <span styleName='show-button'>Show</span>
            <span styleName='edit-button'>Edit</span>
          </div>
        </div>
        <div styleName='three-column-input'>
          <div styleName='column-left'>LOCATION</div>
          <div styleName='column-center'>
            <input
              styleName='signup-input'
              onChange={(e) => this.handleInputChange(e, 'location')}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.submit()
                  this.props.goToNextStep()
                }
              }}
              autoFocus
              value={this.state.edits.location || currentUser && currentUser.name}
              readOnly={this.state.readOnly.name}
            />
          </div>
          <div styleName='column-right'>
            <span styleName='edit-button' onClick={() => this.makeEditable('location')}>Edit</span>
          </div>
        </div>
        <div styleName='three-column-input'>
          <div styleName='column-left'>SKILLS</div>
          <div styleName='column-center'>
            <input
              styleName='signup-input'
              onChange={this.handleLocationChange}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.submit()
                  this.props.goToNextStep()
                }
              }}
              autoFocus
              value={currentUser && currentUser.name}
            />
          </div>
          <div styleName='column-right'>
            <span styleName='edit-button'>Edit</span>
          </div>
        </div>
        <div>
          <SignupModalFooter submit={this.submit} previous={this.previous} showPrevious={false} />
        </div>
      </div>
    </div>
  }
}


export function uploadAvatar (currentUser, loading, avatarUrl) {
  let imageUrl = cameraSvg
  let styleName = 'upload-background-image'

  if (currentUser.avatarUrl) {
    imageUrl = currentUser.avatarUrl
    styleName = 'upload-background-image contain'
  }
  if (avatarUrl) {
    imageUrl = avatarUrl
    styleName = 'upload-background-image contain'
  }
  if (loading) {
    imageUrl = loadingSvg
    styleName = 'loading-background-image'
  }
  return <div styleName='image-upload-icon'>
    <div style={bgImageStyle(imageUrl)} styleName={styleName} />
  </div>
}

export function UploadSection ({avatarUrl, currentUser, updateSettingDirectly, loading}) {
  if (!currentUser) return null
  return <ChangeImageButton
    update={updateSettingDirectly('avatarUrl')}
    uploadSettings={avatarUploadSettings(currentUser)}
    styleName='change-avatar-button'
    child={uploadAvatar(currentUser, loading, avatarUrl)}
  />
}
