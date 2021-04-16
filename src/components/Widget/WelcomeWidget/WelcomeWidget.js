import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './WelcomeWidget.scss'

const { object } = PropTypes

export default class WelcomeWidget extends Component {
  static propTypes = {
    settings: object
  }

  render () {
    const { group, settings = {} } = this.props
    return (
      <div styleName='welcome-widget'>
        <h2>{settings.title || `Welcome to ${group.name}!`}</h2>
        <p>{settings.text || `We're thrilled to have you here`}</p>
      </div>
    )
  }
}
