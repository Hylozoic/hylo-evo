import PropTypes from 'prop-types'
import React, { Component } from 'react'
const { array } = PropTypes

import './AffiliationsWidget.scss'

export default class AffiliationsWidget extends Component {
  static propTypes = {
    map: array
  }

  constructor () {
    super()
  }

  render () {
    return (
      <div>
        Affiliations
      </div>
    )
  }
}
