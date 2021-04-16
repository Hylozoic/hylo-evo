import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './MapWidget.scss'

const { array } = PropTypes

export default class MapWidget extends Component {
  static propTypes = {
    map: array
  }

  render () {
    return (
      <div>
        Community map
      </div>
    )
  }
}
