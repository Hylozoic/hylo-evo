import React, { Component } from 'react'
import { map } from 'lodash'
import cx from 'classnames'
import LeftSidebar from '../LeftSidebar'
import SignupModalFooter from '../SignupModalFooter'
import UploadImageSection from '../UploadImageSection'
import Pillbox from 'components/Pillbox'

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
    if (currentUser && currentUser.settings && currentUser.settings.signupInProgress === 'false') this.props.goBack()
  }

  componentDidMount = () => {
    this.props.fetchMySkills()
  }

  render () {
    const currentAvatarUrl = this.state.edits.avatarUrl

    const { currentUser, uploadImagePending } = this.props
    const skills = currentUser && currentUser.skills && currentUser.skills.toRefArray()
    return <div styleName='wrapper'>
      <LeftSidebar
        header='Everything looking good?'
        body='You can always come back and change your details at any time.'
      />
      <div styleName='detail'>
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
              value={this.state.edits.email || currentUser && currentUser.email}
              readOnly={this.state.readOnly.name}
            />
          </div>
          <div styleName='column-right'>
            <span styleName='edit-button' onClick={() => this.makeEditable('email')}>Edit</span>
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
              value={this.state.edits.location || currentUser && currentUser.location}
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
            <div
              styleName={cx('pill-container', {expanded, collapsed: !expanded})}>
              <Pillbox
                pills={map(skills, skill => ({...skill, label: skill.name}))}
                handleInputChange={this.handleInputChange}
                handleAddition={this.handleAddition}
                handleDelete={this.handleDelete}
                editable={false}
                addLabel='Add a Skill'
                placeholder={null}
                suggestions={null}
              />
            </div>
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

export function Pill ({skill}) {
  return <span styleName='skill'>
    {skill.name}
  </span>
}
