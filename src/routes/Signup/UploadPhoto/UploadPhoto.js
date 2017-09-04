import React, { Component } from 'react'
import LeftSidebar from '../LeftSidebar'
import Loading from 'components/Loading'
import SignupModalFooter from '../SignupModalFooter'
import UploadImageSection from '../UploadImageSection'
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

  componentWillMount = () => {
    const { currentUser } = this.props
    if (currentUser && currentUser.settings.signupInProgress === 'false') this.props.goBack()
  }

  render () {
    const { currentUser, uploadImagePending } = this.props
    const currentAvatarUrl = this.state.edits.avatarUrl
    if (!currentUser) return <Loading />

    return <div styleName='flex-wrapper'>
      <LeftSidebar
        header="Let's complete your profile!"
        body={`Welcome to Hylo, ${currentUser.name}. It only takes a couple seconds to complete your profile. Let's get started!`}
      />
      <div styleName='new-component'>
        <span styleName='white-text step-count'>STEP 1/4</span>
        <br />
        <div styleName='center'>
          <UploadImageSection
            avatarUrl={currentAvatarUrl}
            updateSettingDirectly={this.updateSettingDirectly}
            currentUser={currentUser}
            loading={uploadImagePending}
          />
        </div>
        <div styleName='center'>
          <input
            styleName='signup-input signup-padding large-input-text'
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
          <SignupModalFooter previous={this.previous} submit={this.submit} showPrevious={false} continueText={'Onwards!'} />
        </div>
      </div>
    </div>
  }
}
