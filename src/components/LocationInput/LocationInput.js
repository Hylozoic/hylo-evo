import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { LocationHelpers } from 'hylo-shared'
import Geocoder from 'components/GeocoderAutocomplete'
import { mapbox } from 'config/index'
import styles from './LocationInput.module.scss'
import { withTranslation } from 'react-i18next'

class LocationInput extends Component {
  static propTypes = {
    inputClass: PropTypes.string,
    locationObject: PropTypes.object,
    location: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    pollingFetchLocation: PropTypes.func,
    saveLocationToDB: PropTypes.bool
  }

  static defaultProps = {
    mapboxToken: mapbox.token,
    inputClass: styles.input,
    locationObject: null,
    location: '',
    onChange: null,
    saveLocationToDB: true
  }

  constructor (props) {
    super(props)
    this.state = {
      browserLocation: null
    }
  }

  componentDidMount () {
    if (!this.props.locationObject || !this.props.locationObject.center) {
      navigator.geolocation.getCurrentPosition((position) => this.setState({ browserLocation: { lat: position.coords.latitude, lng: position.coords.longitude } }))
    }
  }

  handleInputChange = inputData => {
    this.props.onChange({ fullText: inputData, id: null })
  }

  handleSelectLocation = data => {
    if (this.props.saveLocationToDB) {
      this.props.pollingFetchLocation(LocationHelpers.convertMapboxToLocation(data), (location) => this.props.onChange(location))
    } else {
      this.props.onChange(LocationHelpers.convertMapboxToLocation(data))
    }
  }

  handleSuggest = e => { }

  render () {
    const { inputClass, locationObject, location, placeholder = this.props.t('Search for a location...'), mapboxToken } = this.props
    const centerAt = (locationObject && locationObject.center) || this.state.browserLocation

    return (
      <div className={styles.wrapper}>
        <Geocoder
          accessToken={mapboxToken}
          defaultInputValue={location}
          onInputChange={this.handleInputChange}
          onSelect={this.handleSelectLocation}
          onSuggest={this.handleSuggest}
          source='mapbox.places'
          endpoint='https://api.tiles.mapbox.com'
          inputClass={inputClass}
          inputPlaceholder={placeholder}
          resultClass={styles.result}
          resultsClass={styles.suggestions}
          resultFocusClass={styles.selectedResult}
          showLoader
          inputPosition='top'
          proximity={centerAt ? centerAt.lng + ',' + centerAt.lat : ''}
          bbox=''
          types=''
        />
      </div>
    )
  }
}

export default withTranslation()(LocationInput)
