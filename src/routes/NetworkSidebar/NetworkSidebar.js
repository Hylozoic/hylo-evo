import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Loading from 'components/Loading'
import { networkSettingsUrl } from 'util/index'

import './NetworkSidebar.scss'

const { bool, object } = PropTypes

export default class NetworkSidebar extends Component {
  static propTypes = {
    network: object,
    isAdmin: bool
  }

  render () {
    const { isAdmin, network, isModerator } = this.props
    if (!network) return <Loading />

    return <div styleName='network-sidebar'>
      {(isAdmin || isModerator) && <Link
        styleName='settings-link'
        to={networkSettingsUrl(network.slug)}>Settings</Link>}
    </div>
  }
}
