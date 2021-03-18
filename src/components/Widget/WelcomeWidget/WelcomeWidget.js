import PropTypes from 'prop-types'
import React, { Component } from 'react'
const { object } = PropTypes

import './WelcomeWidget.scss'

export default class WelcomeWidget extends Component {
  static propTypes = {
    settings: object
  }

  constructor () {
    super()
  }

  render () {
    const { settings = {} } = this.props
    return (
      <div>{settings.text}</div>
    )
  }
}
