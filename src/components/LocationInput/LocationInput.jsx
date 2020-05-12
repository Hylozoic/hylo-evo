import PropTypes from 'prop-types'
import Geocoder from 'react-geocoder-autocomplete'
import React, { Component } from 'react'
import { mapbox } from 'config'
import { convertMapboxToLocation } from './util'
import styles from './LocationInput.scss'

export default class LocationInput extends Component {
  static propTypes = {
    location: PropTypes.object,
    locationText: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    pollingFetchLocation: PropTypes.func
  }

  static defaultProps = {
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

  handleInputChange = data => {
    this.props.pollingFetchLocation(convertMapboxToLocation(data), (location) => this.props.onChange(location))
  }

  handleSuggest = e => { }

  render () {
    const { location, locationText, placeholder } = this.props
    const centerAt = (location && location.center) || this.state.browserLocation

    return (
      <div className={styles.wrapper}>
        <Geocoder
          accessToken={mapbox.token}
          defaultInputValue={locationText}
          onSelect={this.handleInputChange}
          onSuggest={this.handleSuggest}
          source='mapbox.places'
          endpoint='http://api.tiles.mapbox.com'
          inputClass={styles.input}
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
