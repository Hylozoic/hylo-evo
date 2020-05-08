import PropTypes from 'prop-types'
import Geocoder from 'react-geocoder-autocomplete'
import React, { Component } from 'react'
import { mapbox } from 'config'
import { convertMapboxToLocation } from './util'
import styles from './LocationInput.scss'

export default class LocationInput extends Component {
  static propTypes = {
    centerAt: PropTypes.object,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string
  }

  static defaultProps = {
    centerAt: null,
    defaultValue: '',
    onChange: null,
    placeholder: 'Search for location...',
    value: ''
  }

  constructor (props) {
    super(props)
    this.state = {
      centerAt: props.centerAt,
      input: props.value || props.defaultValue,
      location: null,
      locationEdited: false
    }
  }

  componentDidMount = () => {
    if (!this.props.centerAt) {
      navigator.geolocation.getCurrentPosition((position) => this.setState({ centerAt: { lat: position.coords.latitude, lng: position.coords.longitude } }))
    }
  }

  reset = () => {
    this.setState({ data: null, input: this.props.defaultValue, locationEdited: false })
    this.props.onChange(this.props.defaultValue)
  }

  handleInputChange = data => {
    this.setState({ input: data.place_name, location: data })
    console.log('chaning location to ', data)
    this.props.onChange(convertMapboxToLocation(data))
  }

  handleSuggest = e => {
    console.log(e)
  }

  render () {
    const { placeholder } = this.props
    const { centerAt } = this.state

    return (
      <div className={styles.wrapper}>
        <Geocoder
          accessToken={mapbox.token}
          defaultInputValue={this.props.defaultValue}
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
