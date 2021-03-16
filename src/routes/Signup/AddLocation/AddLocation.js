import cx from 'classnames'
import React, { Component } from 'react'
import LocationInput from 'components/LocationInput'
import SignupModalFooter from '../SignupModalFooter'
import Icon from 'components/Icon'
import styles from '../Signup.scss'

export default class AddLocation extends Component {
  constructor () {
    super()
    this.state = {
      locationId: null,
      location: ''
    }
  }

  componentDidMount = () => {
    this.setLocation()
  }

  setLocation = () => {
    const { currentUser } = this.props
    if (currentUser && currentUser.location) {
      this.setState({
        locationId: currentUser.locationObject ? currentUser.locationObject.id : null,
        location: currentUser.location
      })
    }
  }

  handleLocationChange = (location) => {
    this.setState({
      locationId: location.id,
      location: location.fullText
    })
  }

  submit = () => {
    const { locationId, location } = this.state
    const changes = Object.assign({ location, locationId }, { settings: { signupInProgress: false } })
    this.props.updateUserSettings(changes)
    this.props.goToNextStep()
  }

  previous = () => {
    this.props.goToPreviousStep()
  }

  render () {
    const inputClass = cx({
      [styles['signup-input']]: true,
      [styles['signup-padding']]: true,
      [styles['large-input-text']]: true,
      [styles['gray-bottom-border']]: true
    })

    return <div styleName='flex-wrapper'>
      <div styleName='panel'>
        <span styleName='step-count'>STEP 2/3</span>
        <br />
        <div styleName='center'>
          <Icon name='Globe' styleName='globe-icon' />
        </div>
        <div styleName='center location-input'>
          <Icon name='Location' styleName='location-icon' />
          <LocationInput
            saveLocationToDB
            inputClass={inputClass}
            location={this.state.location}
            locationObject={this.props.currentUser ? this.props.currentUser.locationObject : null}
            onChange={this.handleLocationChange}
            placeholder='Where do you call home?'
            onKeyPress={event => {
              if (event.key === 'Enter') {
                this.submit()
              }
            }}
            autofocus
          />
        </div>
        <div styleName='instructions'>
          <p>Add your location to see more relevant content, and find people and projects around you.</p>
        </div>
        <div>
          <SignupModalFooter submit={this.submit} previous={this.previous} continueText={'Next: Confirm your details'} />
        </div>
      </div>
    </div>
  }
}
