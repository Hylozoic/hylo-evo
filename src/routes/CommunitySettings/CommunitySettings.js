import React, { PropTypes, Component } from 'react'
import './CommunitySettings.scss'
import CommunitySettingsTab from './CommunitySettingsTab/CommunitySettingsTab'
import ModeratorsSettingsTab from './ModeratorsSettingsTab/ModeratorsSettingsTab'
import Loading from 'components/Loading'
const { object, func } = PropTypes
import FullPageModal from 'routes/FullPageModal'
import { get } from 'lodash/fp'

export default class CommunitySettings extends Component {
  static propTypes = {
    community: object,
    fetchCommunitySettings: func,
    findModerators: func
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
      moderators,
      removeModerator,
      addModerator,
      findModerators
    } = this.props

    if (!community) return <Loading />

    const { slug } = community

    return <FullPageModal
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
          component: <ModeratorsSettingsTab
            moderators={moderators}
            addModerator={addModerator}
            removeModerator={removeModerator}
            findModerators={findModerators}
          />
        }
      ]} />
  }
}
