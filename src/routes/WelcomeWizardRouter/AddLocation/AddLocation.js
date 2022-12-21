import cx from 'classnames'
import { AnalyticsEvents } from 'hylo-shared'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import LocationInput from 'components/LocationInput'
import { ensureLocationIdIfCoordinate } from 'components/LocationInput/LocationInput.store'
import WelcomeWizardModalFooter from '../WelcomeWizardModalFooter'
import Icon from 'components/Icon'

import styles from '../WelcomeWizard.scss'

class AddLocation extends Component {
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

  submit = async () => {
    const { locationId, location } = this.state
    const { fetchLocation } = this.props

    const coordLocationId = await ensureLocationIdIfCoordinate({ fetchLocation, location, locationId })
    const changes = Object.assign({ location, locationId: coordLocationId }, { settings: { signupInProgress: false } })

    this.props.updateUserSettings(changes)
      .then(() => {
        this.props.trackAnalyticsEvent(AnalyticsEvents.SIGNUP_COMPLETE)
        this.props.goToNextStep()
      })
  }

  previous = () => {
    this.props.goToPreviousStep()
  }

  render () {
    const { t } = this.props
    const inputClass = cx({
      [styles['input']]: true,
      [styles['padding']]: true,
      [styles['large-input-text']]: true,
      [styles['gray-bottom-border']]: true
    })

    return (
      <div styleName='flex-wrapper'>
        <div styleName='panel'>
          <span styleName='step-count'>{this.props.t('STEP 2/3')}</span>
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
              placeholder={this.props.t('Where do you call home?')}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.submit()
                }
              }}
              autofocus
            />
          </div>
          <div styleName='instructions'>
            <p>{this.props.t('Add your location to see more relevant content, and find people and projects around you')}.</p>
          </div>
          <div>
            <WelcomeWizardModalFooter submit={this.submit} previous={this.previous} continueText={this.props.t('Next: Welcome to Hylo!')} />
          </div>
        </div>
      </div>
    )
  }
}
export default withTranslation()(AddLocation)
