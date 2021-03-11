import PropTypes from 'prop-types'
import React, { Component } from 'react'
const { array } = PropTypes

import './MapWidget.scss'

export default class MapWidget extends Component {
  static propTypes = {
    map: array
  }

  constructor () {
    super()
  }

  render () {
    return (
      <div>
        Community map
      </div>
    )
  }
}
