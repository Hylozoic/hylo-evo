import React, { Component } from 'react'
import LeftSidebar from '../LeftSidebar'
import { bgImageStyle } from 'util/index'
import SignupModalFooter from '../SignupModalFooter'
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

  goBackIfAlreadySignedup = () => {
    const { currentUser } = this.props
    if (currentUser && currentUser.settings.signupInProgress === 'false') this.props.goBack()
  }
  render () {
    this.goBackIfAlreadySignedup()
    const { currentUser } = this.props
    return <div styleName='wrapper'>
      <LeftSidebar
        header='Everything looking good?'
        body='You can always come back and change your details at any time.'
      />
      <div styleName='detail'>
        <span styleName='white-text step-count'>STEP 4/4</span>
        <br />
        <div styleName='center'>
          <div styleName='logo center round' style={bgImageStyle(currentUser && currentUser.avatarUrl)} />
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
