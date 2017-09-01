import React, { Component } from 'react'
import { avatarUploadSettings } from 'store/models/Me'
import ChangeImageButton from 'components/ChangeImageButton'
import { cameraSvg, loadingSvg } from 'util/assets'
import LeftSidebar from '../LeftSidebar'
import Loading from 'components/Loading'
import { bgImageStyle } from 'util/index'
import SignupModalFooter from '../SignupModalFooter'
import '../Signup.scss'

export default class UploadPhoto extends Component {
  constructor () {
    super()
    this.state = {
      edits: {}
    }
  }

  submit = () => {
    this.setState({changed: false})
    this.props.updateUserSettings(this.state.edits)
    this.props.goToNextStep()
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

  render () {
    const { currentUser, uploadImagePending } = this.props
    const currentAvatarUrl = this.state.edits.avatarUrl
    if (!currentUser) return <Loading />

    return <div styleName='wrapper'>
      <LeftSidebar
        header="Let's complete your profile!"
        body={`Welcome to Hylo, ${currentUser.name}. It only takes a couple seconds to complete your profile. Let's get started!`}
      />
      <div styleName='detail'>
        <span styleName='white-text step-count'>STEP 1/4</span>
        <br />
        <div styleName='center'>
          <UploadSection
            avatarUrl={currentAvatarUrl}
            updateSettingDirectly={this.updateSettingDirectly}
            currentUser={currentUser}
            loading={uploadImagePending}
          />
        </div>
        <div styleName='center center-vertical'>
          <input
            styleName='signup-input'
            value={'Upload a profile photo'}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                this.submit()
              }
            }}
            readOnly
          />
        </div>
        <div>
          <SignupModalFooter previous={this.previous} submit={this.submit} showPrevious={false} />
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
  return <ChangeImageButton
    update={updateSettingDirectly('avatarUrl')}
    uploadSettings={avatarUploadSettings(currentUser)}
    styleName='change-avatar-button'
    child={uploadAvatar(currentUser, loading, avatarUrl)}
  />
}
