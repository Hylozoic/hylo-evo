import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './WelcomeWidget.scss'

const { object } = PropTypes

export default class WelcomeWidget extends Component {
  static propTypes = {
    settings: object
  }

  render () {
    const { settings = {} } = this.props
    return (
      <div>{settings ? settings.text : ''}</div>
    )
  }
}
