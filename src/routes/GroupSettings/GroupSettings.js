import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './GroupSettings.scss'
import GroupSettingsTab from './GroupSettingsTab'
import MembershipRequestsTab from './MembershipRequestsTab'
import ModeratorsSettingsTab from './ModeratorsSettingsTab'
import ImportExportSettingsTab from './ImportExportSettingsTab'
import InviteSettingsTab from './InviteSettingsTab'
import DeleteSettingsTab from './DeleteSettingsTab'
import RelatedGroupsTab from './RelatedGroupsTab'
import TopicsSettingsTab from './TopicsSettingsTab'
import Loading from 'components/Loading'
import FullPageModal from 'routes/FullPageModal'
import { get } from 'lodash/fp'
import { Redirect } from 'react-router'
import { groupUrl } from 'util/navigation'

const { object, func } = PropTypes

export default class GroupSettings extends Component {
  static propTypes = {
    currentUser: object,
    group: object,
    fetchGroupSettings: func
  }

  componentDidMount () {
    this.props.fetchGroupSettings()
  }

  componentDidUpdate (prevProps, prevState) {
    if (get('group.slug', prevProps) !== get('group.slug', this.props)) {
      this.props.fetchGroupSettings()
    }
  }

  render () {
    const {
      group,
      currentUser,
      updateGroupSettings,
      canModerate,
      deleteGroup,
      upload
    } = this.props

    if (!group) return <Loading />

    if (!canModerate) return <Redirect to={groupUrl(group.slug)} />

    const { slug } = group

    return <FullPageModal goToOnClose={`/g/${slug}`}
      content={[
        {
          name: 'Settings',
          path: `/g/${slug}/settings`,
          component: <GroupSettingsTab
            group={group}
            currentUser={currentUser}
            updateGroupSettings={updateGroupSettings}
          />
        },
        {
          name: 'Moderators',
          path: `/g/${slug}/settings/moderators`,
          component: <ModeratorsSettingsTab groupId={group.id} slug={group.slug} />
        },
        {
          name: 'Topics',
          path: `/g/${slug}/settings/topics`,
          component: <TopicsSettingsTab group={group} />
        },
        {
          name: 'Invite',
          path: `/g/${slug}/settings/invite`,
          component: <InviteSettingsTab group={group} />
        },
        {
          name: 'Join Requests',
          path: `/g/${slug}/settings/requests`,
          component: <MembershipRequestsTab
            group={group}
            currentUser={currentUser}
          />
        },
        {
          name: 'Related Groups',
          path: `/g/${slug}/settings/groups`,
          component: <RelatedGroupsTab
            group={group}
            currentUser={currentUser}
          />
        },
        {
          name: '',
          path: `/g/${slug}/settings/import`,
          component: <ImportExportSettingsTab
            group={group}
            upload={upload}
          />
        },
        {
          name: 'Delete',
          path: `/g/${slug}/settings/delete`,
          component: <DeleteSettingsTab group={group} deleteGroup={deleteGroup} />
        }
      ]} />
  }
}
