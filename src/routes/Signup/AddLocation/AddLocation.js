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
      locationText: ''
    }
  }
  handleLocationChange = (event) => {
    const locationText = event.target.value
    this.setState({
      locationText
    })
  }
  setLocation = () => {
    const { currentUser } = this.props
    if (currentUser && currentUser.locationText) {
      this.setState({ locationText: currentUser.locationText })
    }
  }
  submit = () => {
    const locationText = this.state.locationText
    this.props.updateUserSettings({ locationText })
    this.props.goToNextStep()
  }

  previous = () => {
    this.props.goToPreviousStep()
  }

  componentDidMount = () => {
    this.setLocation()
  }

  render () {
    return <div styleName='flex-wrapper'>
      <LeftSidebar
        header='Add your location'
        body='Add your location to see more relevant content, and find people and projects around you.'
      />
      <div styleName='panel'>
        <span styleName='white-text step-count'>STEP 2/4</span>
        <br />
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center'>
          <input
            styleName='signup-input signup-padding large-input-text gray-bottom-border'
            onChange={this.handleLocationChange}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                this.submit()
              }
            }}
            value={this.state.locationText}
            autoFocus
            placeholder={'Where do you call home?'}
          />
        </div>
        <div>
          <SignupModalFooter submit={this.submit} previous={this.previous} continueText={'One Last Step'} />
        </div>
      </div>
    </div>
  }
}
