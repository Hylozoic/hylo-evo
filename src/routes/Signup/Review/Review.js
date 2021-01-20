import React, { Component, createRef } from 'react'
import { get } from 'lodash/fp'
import { bgImageStyle } from 'util/index'
import Icon from 'components/Icon'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import LeftSidebar from '../LeftSidebar'
import SignupModalFooter from '../SignupModalFooter'
import '../Signup.scss'

export default class Review extends Component {
  constructor () {
    super()
    const fields = ['name', 'email', 'location']
    this.inputRefs = fields.reduce((acc, name) => {
      acc[name] = createRef()
      return acc
    }, {})
    this.state = {
      edits: fields.reduce((acc, name) => {
        acc[name] = null
        return acc
      }, {}),
      readOnly: fields.reduce((acc, name) => {
        acc[name] = true
        return acc
      }, {})
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

  makeEditable = (name) => {
    this.setState({
      readOnly: {
        ...this.state.readOnly,
        [name]: false
      }
    })
    this.inputRefs[name].current.select()
  }

  submit = () => {
    const { edits } = this.state
    Object.keys(edits).forEach((key) => (edits[key] == null) && delete edits[key])
    const changes = Object.assign(edits, { settings: { signupInProgress: false } })
    this.props.updateUserSettings(changes)
      .then(() => {
        this.props.trackAnalyticsEvent('Signup Complete')
        this.props.goToNextStep()
      })
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

  componentDidMount = () => {
    // this.props.fetchMySkills()
  }

  getValue = (field) => {
    return this.state.edits[field] || get(field, this.props.currentUser)
  }

  render () {
    const { currentUser, uploadImagePending } = this.props
    const currentAvatarUrl = this.getValue('avatarUrl')

    return <div styleName='flex-wrapper'>
      <LeftSidebar
        header='Everything looking good?'
        body='You can always come back and change your details at any time.'
      />
      <div styleName='panel'>
        <span styleName='white-text step-count'>STEP 4/4</span>
        <br />
        <div styleName='center'>
          {currentUser && <UploadAttachmentButton
            type='userAvatar'
            id={currentUser.id}
            onSuccess={({ url }) => this.updateSettingDirectly('avatarUrl')(url)}>
            <div styleName='avatar' style={bgImageStyle(currentAvatarUrl)}>
              <Icon styleName='upload-icon' name={uploadImagePending ? 'Clock' : 'AddImage'} />
            </div>
          </UploadAttachmentButton>}
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
                ref={this.inputRefs['name']}
                value={this.getValue('name')}
                readOnly={this.state.readOnly['name']}
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
                ref={this.inputRefs['email']}
                value={this.getValue('email')}
                readOnly={this.state.readOnly['email']}
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
                readOnly
              />
            </div>
            <div styleName='right-input-column'>
              <span styleName='edit-button text-opacity' onClick={() => this.props.push('/signup/add-location')}>Edit</span>
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

// FIXME Skills Component

// export function Pill ({ skill }) {
//   return <span styleName='review-skill'>
//     {skill.name}
//   </span>
// }

// <div styleName='three-column-input gray-bottom-border'>
//   <div styleName='left-input-column'>
//     <span styleName='text-opacity'>SKILLS</span>
//   </div>
//   <div styleName='center-input-column-scrollable'>
//     {this.props.skills.map((skill, index) =>
//       <div key={index}>
//         <Pill skill={skill} handlerArg={'name'} />
//       </div>
//     )}
//   </div>
//   <div styleName='right-input-column'>
//     <span styleName='edit-button text-opacity' onClick={this.props.goBack}>Edit</span>
//   </div>
// </div>
