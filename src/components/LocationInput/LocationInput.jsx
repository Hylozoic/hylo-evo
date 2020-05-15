import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Geocoder from 'components/GeocoderAutocomplete'
import { mapbox } from 'config'
import { convertMapboxToLocation } from './util'
import styles from './LocationInput.scss'

export default class LocationInput extends Component {
  static propTypes = {
    inputClass: PropTypes.string,
    location: PropTypes.object,
    locationText: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    pollingFetchLocation: PropTypes.func
  }

  static defaultProps = {
    inputClass: styles.input,
    location: null,
    locationText: '',
    onChange: null,
    placeholder: 'Search for a location...'
  }

  constructor (props) {
    super(props)
    this.state = {
      browserLocation: null
    }
  }

  componentDidMount () {
    if (!this.props.location || !this.props.location.center) {
      navigator.geolocation.getCurrentPosition((position) => this.setState({ browserLocation: { lat: position.coords.latitude, lng: position.coords.longitude } }))
    }
  }

  handleInputChange = inputData => {
    this.props.onChange({ fullText: inputData, id: null })
  }

  handleSelectLocation = data => {
    this.props.pollingFetchLocation(convertMapboxToLocation(data), (location) => this.props.onChange(location))
  }

  handleSuggest = e => { }

  render () {
    const { inputClass, location, locationText, placeholder } = this.props
    const centerAt = (location && location.center) || this.state.browserLocation

    return (
      <div className={styles.wrapper}>
        <Geocoder
          accessToken={mapbox.token}
          defaultInputValue={locationText}
          onInputChange={this.handleInputChange}
          onSelect={this.handleSelectLocation}
          onSuggest={this.handleSuggest}
          source='mapbox.places'
          endpoint='http://api.tiles.mapbox.com'
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
          focusOnMount
        />
      </div>
    )
  }
}
