import PropTypes from 'prop-types'
import React, { Component } from 'react'
const { array } = PropTypes

import './OffersAndRequestsWidget.scss'

export default class OffersAndRequestsWidget extends Component {
  static propTypes = {
    offersAndRequests: array
  }

  constructor () {
    super()
  }

  render () {
    const { offersAndRequests } = this.props
    return (
      <div>
        {offersAndRequests.map(a => <div>{a.title}</div>)}
      </div>
    )
  }
}
