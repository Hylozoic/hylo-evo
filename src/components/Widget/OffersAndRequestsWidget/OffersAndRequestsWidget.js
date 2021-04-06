import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './OffersAndRequestsWidget.scss'

const { array } = PropTypes

export default class OffersAndRequestsWidget extends Component {
  static propTypes = {
    offersAndRequests: array
  }

  render () {
    const { offersAndRequests } = this.props
    return (
      <div>
        {offersAndRequests && offersAndRequests.map(a => <div>{a.title}</div>)}
      </div>
    )
  }
}
