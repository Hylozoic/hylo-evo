import cx from 'classnames'
import React, { Component } from 'react'
import LeftSidebar from '../LeftSidebar'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import LocationInput from 'components/LocationInput'
import SignupModalFooter from '../SignupModalFooter'
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
    this.props.updateUserSettings({ location, locationId })
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
          />
        </div>
        <div>
          <SignupModalFooter submit={this.submit} previous={this.previous} continueText={'One Last Step'} />
        </div>
      </div>
    </div>
  }
}
