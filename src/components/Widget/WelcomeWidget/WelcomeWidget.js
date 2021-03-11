import PropTypes from 'prop-types'
import React, { Component } from 'react'
const { array } = PropTypes

import './WelcomeWidget.scss'

export default class WelcomeWidget extends Component {
  static propTypes = {
    map: array
  }

  constructor () {
    super()
  }

  render () {
    return (
      <div>
        Welcome
      </div>
    )
  }
}
