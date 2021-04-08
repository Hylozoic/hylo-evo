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
      <div styleName='welcome-widget'>
        <h2>Example title</h2>
        <p>Example text {settings ? settings.text : ''}</p>
      </div>
    )
  }
}
