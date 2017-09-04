import React, { Component } from 'react'
import LeftSidebar from '../LeftSidebar'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import SignupModalFooter from '../SignupModalFooter'
import '../Signup.scss'

export default class AddLocation extends Component {
  constructor () {
    super()
    this.state = {
      location: ''
    }
  }
  handleLocationChange = (event) => {
    const location = event.target.value
    this.setState({
      location
    })
  }
  setLocation = () => {
    const { currentUser } = this.props
    if (currentUser && currentUser.location) {
      this.setState({location: currentUser.location})
    }
  }
  submit = () => {
    const location = this.state.location
    this.props.updateUserSettings({location})
    this.props.goToNextStep()
  }

  previous = () => {
    this.props.goToPreviousStep()
  }

  componentWillMount = () => {
    const { currentUser } = this.props
    if (currentUser && currentUser.settings.signupInProgress === 'false') this.props.goBack()
  }

  componentDidMount = () => {
    this.setLocation()
  }

  render () {
    return <div styleName='wrapper'>
      <LeftSidebar
        header='Add your location'
        body='Add your location to see more relevant content, and find people and projects around you.'
      />
      <div styleName='detail'>
        <span styleName='white-text step-count'>STEP 2/4</span>
        <br />
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center center-vertical'>
          <input
            styleName='signup-input'
            onChange={this.handleLocationChange}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                this.submit()
                this.props.goToNextStep()
              }
            }}
            value={this.state.location}
            autoFocus
            placeholder={'Where do you call home?'}
          />
        </div>
        <div>
          <SignupModalFooter submit={this.submit} previous={this.previous} />
        </div>
      </div>
    </div>
  }
}
