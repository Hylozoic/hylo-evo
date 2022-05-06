import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './RichText.scss'

const { object } = PropTypes

export default class RichTextWidget extends Component {
  static propTypes = {
    settings: object
  }

  render () {
    const { group, settings = {} } = this.props
    return (
      <div styleName='rich-text'>
        <h2>{settings.title || `Welcome to ${group.name}!`}</h2>
        <p>{settings.text || `We're happy you're here! Please take a moment to explore this page to see what's alive in our group. Introduce yourself by clicking Create to post a Discussion sharing who you are and what brings you to our group. And don't forget to fill out your profile - so likeminded new friends can connect with you!`}</p>
      </div>
    )
  }
}
