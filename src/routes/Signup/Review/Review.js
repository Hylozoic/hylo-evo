import React, { Component } from 'react'
import { get } from 'lodash/fp'
import LeftSidebar from '../LeftSidebar'
import SignupModalFooter from '../SignupModalFooter'
import UploadImageSection from '../UploadImageSection'

import '../Signup.scss'

export default class AddLocation extends Component {
  constructor () {
    super()
    this.state = {
      edits: {
        name: null,
        email: null,
        location: null
      },
      readOnly: {
        name: true,
        email: true,
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
    const { edits } = this.state
    Object.keys(edits).forEach((key) => (edits[key] == null) && delete edits[key])
    const changes = Object.assign(edits, {settings: {signupInProgress: false}})
    this.props.updateUserSettings(changes)
    this.props.resetIsSigningUp()
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
    if (currentUser && !get('settings.signupInProgress', currentUser)) this.props.goBack()
  }

  componentDidMount = () => {
    this.props.fetchMySkills()
  }

  getValue = (field) => {
    return this.state.edits[field] || get(field, this.props.currentUser)
  }

  render () {
    const currentAvatarUrl = this.state.edits.avatarUrl
    const { currentUser, uploadImagePending } = this.props
    return <div styleName='flex-wrapper'>
      <LeftSidebar
        header='Everything looking good?'
        body='You can always come back and change your details at any time.'
      />
      <div styleName='panel'>
        <span styleName='white-text step-count'>STEP 4/4</span>
        <br />
        <div styleName='center'>
          {currentUser && <UploadImageSection
            avatarUrl={currentAvatarUrl}
            updateSettingDirectly={this.updateSettingDirectly}
            currentUser={currentUser}
            loading={uploadImagePending}
          />}
        </div>
        <div styleName='final-edit'>
          <div styleName='three-column-input gray-bottom-border'>
            <div styleName='left-input-column'>
              <span styleName='text-opacity'>YOUR NAME</span>
            </div>
            <div styleName='center-input-column'>
              <input
                styleName='signup-input review-input-padding'
                onChange={(e) => this.handleInputChange(e, 'name')}
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    this.submit()
                  }
                }}
                autoFocus
                value={this.getValue('name')}
                readOnly={this.state.readOnly.name}
              />
            </div>
            <div styleName='right-input-column'>
              <span styleName='edit-button text-opacity' onClick={() => this.makeEditable('name')}>Edit</span>
            </div>
          </div>
          <div styleName='three-column-input gray-bottom-border'>
            <div styleName='left-input-column'>
              <span styleName='text-opacity'>YOUR EMAIL</span>
            </div>
            <div styleName='center-input-column'>
              <input
                styleName='signup-input review-input-padding'
                onChange={(e) => this.handleInputChange(e, 'email')}
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    this.submit()
                    this.props.goToNextStep()
                  }
                }}
                autoFocus
                value={this.getValue('email')}
                readOnly={this.state.readOnly.email}
              />
            </div>
            <div styleName='right-input-column'>
              <span styleName='edit-button text-opacity' onClick={() => this.makeEditable('email')}>Edit</span>
            </div>
          </div>
          <div styleName='three-column-input gray-bottom-border'>
            <div styleName='left-input-column'>
              <span styleName='text-opacity'>LOCATION</span>
            </div>
            <div styleName='center-input-column'>
              <input
                styleName='signup-input review-input-padding'
                onChange={(e) => this.handleInputChange(e, 'location')}
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    this.submit()
                    this.props.goToNextStep()
                  }
                }}
                autoFocus
                value={this.getValue('location')}
                readOnly={this.state.readOnly.location}
              />
            </div>
            <div styleName='right-input-column'>
              <span styleName='edit-button text-opacity' onClick={() => this.makeEditable('email')}>Edit</span>
            </div>
          </div>
          <div styleName='three-column-input gray-bottom-border'>
            <div styleName='left-input-column'>
              <span styleName='text-opacity'>SKILLS</span>
            </div>
            <div styleName='center-input-column-scrollable'>
              {this.props.skills.map((skill, index) =>
                <div key={index}>
                  <Pill skill={skill} handlerArg={'name'} />
                </div>
              )}
            </div>
            <div styleName='right-input-column'>
              <span styleName='edit-button text-opacity' onClick={this.props.goBack}>Edit</span>
            </div>
          </div>
        </div>
        <div>
          <SignupModalFooter submit={this.submit} previous={this.previous} showPrevious={false} continueText={"Let's do this!"} />
        </div>
      </div>
    </div>
  }
}

export function Pill ({skill}) {
  return <span styleName='review-skill'>
    {skill.name}
  </span>
}
