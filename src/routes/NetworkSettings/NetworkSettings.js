import PropTypes from 'prop-types'
import React, { Component } from 'react'
import NetworkSettingsTab from './NetworkSettingsTab'
import NetworkModeratorsTab from './NetworkModeratorsTab'
import NetworkCommunitiesTab from './NetworkCommunitiesTab'

import FullPageModal from 'routes/FullPageModal'
import Loading from 'components/Loading'

import './NetworkSettings.scss'

const { bool, func, object } = PropTypes

export default class NetworkSettings extends Component {
  static propTypes = {
    isAdmin: bool,
    network: object,
    updateNetworkSettings: func.isRequired
  }

  state = {
    changed: false,
    communityChoice: null,
    communitySearch: '',
    edits: {},
    moderatorChoice: null,
    moderatorSearch: ''
  }

  componentDidMount () {
    this.props.fetchNetworkSettings()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.network && prevProps.network && prevProps.network.id !== this.props.network.id) {
      this.props.fetchNetworkSettings()
    }
  }

  render () {
    const {
      isAdmin,
      isModerator,
      network,
      updateNetworkSettings,
      setConfirm
    } = this.props

    if (!network) return <FullPageModal><Loading /></FullPageModal>
    //if (!isAdmin && !isModerator) {
    //  return <FullPageModal goToOnClose={`/n/${network.slug}`}>
    //    Sorry, you must be an admin to access this page.
    //  </FullPageModal>
    //}

    return <FullPageModal narrow goToOnClose={`/n/${network.slug}`}
      content={[
        {
          name: 'Settings',
          path: `/n/${network.slug}/settings`,
          component: <NetworkSettingsTab
            network={network}
            setConfirm={setConfirm}
            updateNetworkSettings={updateNetworkSettings}
          />
        }, {
          name: 'Moderators',
          path: `/n/${network.slug}/settings/moderators`,
          component: <NetworkModeratorsTab network={network} />
        }, {
          name: 'Communities',
          path: `/n/${network.slug}/settings/communities`,
          component: <NetworkCommunitiesTab network={network} />
        }
      ]} />
  }
}
