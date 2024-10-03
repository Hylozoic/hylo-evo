import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'

import classes from './MapWidget.module.scss'

const { array } = PropTypes

class MapWidget extends Component {
  static propTypes = {
    map: array
  }

  render () {
    return (
      <div>
        {this.props.t('Community map')}
      </div>
    )
  }
}

export default withTranslation()(MapWidget)
