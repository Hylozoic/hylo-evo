import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { useTranslation } from 'react-i18next'

import './MapWidget.scss'

const { array } = PropTypes
const { t } = useTranslation()

export default class MapWidget extends Component {
  static propTypes = {
    map: array
  }

  render () {
    return (
      <div>
        {t('MapWidget.communityMap')}
      </div>
    )
  }
}
