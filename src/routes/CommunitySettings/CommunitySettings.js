import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './CommunitySettings.scss'
import CommunitySettingsTab from './CommunitySettingsTab'
import ModeratorsSettingsTab from './ModeratorsSettingsTab'
import InviteSettingsTab from './InviteSettingsTab'
import DeleteSettingsTab from './DeleteSettingsTab'
import Loading from 'components/Loading'
import FullPageModal from 'routes/FullPageModal'
import { get } from 'lodash/fp'
import { Redirect } from 'react-router'
import { communityUrl } from 'util/navigation'

const { object, func } = PropTypes

export default class CommunitySettings extends Component {
  static propTypes = {
    community: object,
    fetchCommunitySettings: func
  }

  componentDidMount () {
    this.props.fetchCommunitySettings()
  }

  componentDidUpdate (prevProps, prevState) {
    if (get('community.slug', prevProps) !== get('community.slug', this.props)) {
      this.props.fetchCommunitySettings()
    }
  }

  render () {
    const {
      community,
      updateCommunitySettings,
      canModerate,
      deleteCommunity
    } = this.props

    if (!community) return <Loading />

    if (!canModerate) return <Redirect to={communityUrl(community.slug)} />

    const { slug } = community

    return <FullPageModal goToOnClose={`/c/${slug}`}
      content={[
        {
          name: 'Settings',
          path: `/c/${slug}/settings`,
          component: <CommunitySettingsTab
            community={community}
            updateCommunitySettings={updateCommunitySettings}
          />
        },
        {
          name: 'Moderators',
          path: `/c/${slug}/settings/moderators`,
          component: <ModeratorsSettingsTab communityId={community.id} slug={community.slug} />
        },
        {
          name: 'Invite',
          path: `/c/${slug}/settings/invite`,
          component: <InviteSettingsTab community={community} />
        },
        {
          name: 'Delete',
          path: `/c/${slug}/settings/delete`,
          component: <DeleteSettingsTab community={community} deleteCommunity={deleteCommunity} />
        }
      ]} />
  }
}
