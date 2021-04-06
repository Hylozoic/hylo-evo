import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './AffiliationsWidget.scss'

const { array } = PropTypes

export default class AffiliationsWidget extends Component {
  static propTypes = {
    map: array
  }

  render () {
    return (
      <div>
        Affiliations
      </div>
    )
  }
}
