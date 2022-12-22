import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { get } from 'lodash/fp'
import { bgImageStyle } from 'util/index'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import WelcomeWizardModalFooter from '../WelcomeWizardModalFooter'
import '../WelcomeWizard.scss'

class UploadPhoto extends Component {
  constructor () {
    super()
    this.state = {
      edits: {}
    }
  }

  submit = () => {
    this.setState({ changed: false })
    this.props.updateUserSettings(this.state.edits)
    this.props.goToNextStep()
  }

  updateSettingDirectly = (key, setChanged) => value => {
    const { edits, changed } = this.state
    this.setState({
      changed: setChanged ? true : changed,
      edits: {
        ...edits,
        [key]: value
      }
    })
  }

  getValue = (field) => {
    return this.state.edits[field] || get(field, this.props.currentUser)
  }

  render () {
    const { currentUser, uploadImagePending, t } = this.props

    if (!currentUser) return <Loading />

    const currentAvatarUrl = this.getValue('avatarUrl')

    return <div styleName='flex-wrapper'>
      <div styleName='panel'>
        <span styleName='step-count'>{this.props.t('STEP 1/3')}</span>
        <br />
        <div styleName='center'>
          <div styleName='uploadWrapper'>
            <UploadAttachmentButton
              type='userAvatar'
              id={currentUser.id}
              onSuccess={({ url }) => this.updateSettingDirectly('avatarUrl')(url)}>
              <div styleName='avatar' style={bgImageStyle(currentAvatarUrl)}>
                <Icon styleName='upload-icon' name={uploadImagePending ? 'Clock' : 'AddImage'} />
              </div>
            </UploadAttachmentButton>
          </div>
        </div>
        <div styleName='instructions'>
          <h3>{this.props.t('Upload a profile image')}</h3>
          <p>{this.props.t('Almost done setting up your profile! Click the above profile icon to upload a custom profile image. Your profile image will be visible when you post or comment in groups.')}</p>
        </div>
        <div>
          <WelcomeWizardModalFooter previous={this.previous} submit={this.submit} showPrevious={false} continueText={this.props.t('Next: Where are you from?')} />
        </div>
      </div>
    )
  }
}
export default withTranslation()(UploadPhoto)
