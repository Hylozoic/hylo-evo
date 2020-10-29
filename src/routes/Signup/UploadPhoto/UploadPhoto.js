import React, { Component } from 'react'
import { get } from 'lodash/fp'
import { bgImageStyle } from 'util/index'
import Loading from 'components/Loading'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import LeftSidebar from '../LeftSidebar'
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
    const { currentUser, uploadImagePending } = this.props
    
    if (!currentUser) return <Loading />

    const currentAvatarUrl = this.getValue('avatarUrl')

    return <div styleName='flex-wrapper'>
      <LeftSidebar
        header="Let's complete your profile!"
        body={`Welcome to Hylo, ${currentUser.name}. It only takes a couple seconds to complete your profile. Let's get started!`}
      />
      <div styleName='panel'>
        <span styleName='white-text step-count'>STEP 1/4</span>
        <br />
        <div styleName='center'>
          <div style={bgImageStyle(currentAvatarUrl)} styleName='avatar'>
            <UploadAttachmentButton
              styleName='change-avatar-button'
              type='userAvatar'
              id={currentUser.id}
              onSuccess={({ url }) => this.updateSettingDirectly('avatarUrl')(url)}
              loading={uploadImagePending} />
          </div>
        </div>
        <div styleName='center'>
          <input
            styleName='signup-input signup-padding large-input-text gray-bottom-border'
            value={'Upload a profile photo'}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                this.submit()
              }
            }}
            autoFocus
            readOnly
          />
        </div>
        <div>
          <SignupModalFooter previous={this.previous} submit={this.submit} showPrevious={false} continueText={'Onwards!'} />
        </div>
      </div>
    </div>
  }
}
