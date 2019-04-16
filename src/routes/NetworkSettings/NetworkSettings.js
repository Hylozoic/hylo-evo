import PropTypes from 'prop-types'
import React, { Component } from 'react'
import NetworkSettingsTab from './NetworkSettingsTab'
import NetworkModeratorsTab from './NetworkModeratorsTab'
import NetworkCommunitiesTab from './NetworkCommunitiesTab'
import NetworkCommunitySettings from './NetworkCommunitySettings'
import { pullAt } from 'lodash'
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
      loading,
      network,
      updateNetworkSettings,
      setConfirm
    } = this.props

    if (!network || loading) return <FullPageModal><Loading /></FullPageModal>
    if (!isAdmin && !isModerator) {
      return <FullPageModal goToOnClose={`/n/${network.slug}`}>
        Sorry, you must be an admin to access this page.
      </FullPageModal>
    }

    const content = [
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
        component: <NetworkCommunitiesTab network={network} isModerator={isModerator} isAdmin={isAdmin} />
      },
      {
        path: `/n/${network.slug}/settings/communities/:slug`,
        render: props => (
          <NetworkCommunitySettings network={network} isModerator={isModerator} isAdmin={isAdmin} match={props.match} />
        ) }
    ]

    // Remove the moderators tab when not a HyloAdmin
    if (!isAdmin) {
      pullAt(content, 1)
    }

    return <FullPageModal narrow goToOnClose={`/n/${network.slug}`} content={content} />
  }
}
