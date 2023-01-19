import cx from 'classnames'
import { compact } from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Tooltip from 'components/Tooltip'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import Select from 'components/Select'
import { bgImageStyle } from 'util/index'

import './NotificationSettingsTab.scss'

const allGroupsLogo = '/hylo-merkaba.png'

const { object, func } = PropTypes

const iOSAppURL = 'https://itunes.apple.com/app/appName/id1002185140'
const androidAppURL = 'https://play.google.com/store/apps/details?id=com.hylo.hyloandroid'

export default class NotificationSettingsTab extends Component {
  static propTypes = {
    currentUser: object,
    updateUserSettings: func
  }

  updateMessageSettings = changes => {
    const { messageSettings, updateUserSettings } = this.props
    const newMessageSettings = {
      ...messageSettings,
      ...changes
    }
    let dmNotifications
    if (newMessageSettings['sendEmail'] && newMessageSettings['sendPushNotifications']) {
      dmNotifications = 'both'
    } else if (newMessageSettings['sendEmail']) {
      dmNotifications = 'email'
    } else if (newMessageSettings['sendPushNotifications']) {
      dmNotifications = 'push'
    } else {
      dmNotifications = 'none'
    }
    updateUserSettings({
      settings: {
        dmNotifications
      }
    })
  }

  updateAllGroups = changes => {
    const { memberships, updateAllMemberships } = this.props
    updateAllMemberships(memberships.map(m => m.group.id), changes)
  }

  updateAllGroupsAlert = changes => {
    const key = ('sendEmail' in changes) ? 'sendEmail' : 'sendPushNotifications'

    const type = key === 'sendEmail' ? 'Email' : 'Push Notifications'
    const onOrOff = changes[key] ? 'ON' : 'OFF'
    const numGroups = this.props.memberships.length

    if (window.confirm(`You wish to turn ${onOrOff} ${type} for all groups? This will affect ${numGroups} ${numGroups === 1 ? 'group' : 'groups'}`)) {
      this.updateAllGroups(changes)
    }
  }

  render () {
    const {
      currentUser, updateUserSettings, memberships, updateMembershipSettings, allGroupsSettings,
      messageSettings
    } = this.props

    if (!currentUser) return <Loading />

    const { settings = {}, hasDevice } = currentUser

    const updateSetting = setting => value => {
      updateUserSettings({ settings: { [setting]: value } })
    }

    var notificationOptions = compact([
      { id: 'none', label: 'None' },
      { id: 'email', label: 'Email' },
      hasDevice && { id: 'push', label: 'Mobile App' },
      hasDevice && { id: 'both', label: 'Both' }
    ])

    const getSetting = setting => {
      if (!hasDevice && settings[setting] === 'both') return 'email'
      return settings[setting]
    }

    return (
      <div>
        <div styleName='title'><Icon name='Notifications' />Notifications</div>
        <div styleName='global-setting'>
          <div styleName='prompt'>How often would you like to receive email digests
            for new posts in your groups and saved searches?</div>
          <div styleName='setting-select'>
            <div styleName='select-explanation'>Send me a digest</div>
            <Select
              onChange={updateSetting('digestFrequency')}
              selected={settings['digestFrequency']}
              options={[
                { id: 'daily', label: 'Daily' },
                { id: 'weekly', label: 'Weekly' },
                { id: 'never', label: 'Never' }
              ]} />
          </div>
        </div>
        <div styleName='global-setting'>
          <div styleName='prompt'>How would you like to receive notifications about
            new comments on posts you're following?</div>
          <div styleName='setting-select'>
            <div styleName='select-explanation'>Notify me via</div>
            <Select
              onChange={updateSetting('commentNotifications')}
              selected={getSetting('commentNotifications')}
              options={notificationOptions} />
          </div>
        </div>
        <div>
          <div styleName='individual-groups'>NOTIFICATIONS</div>
          <MessageSettingsRow
            settings={messageSettings}
            updateMessageSettings={this.updateMessageSettings} />

          <div styleName='individual-groups'>GROUP NOTIFICATIONS</div>

          <AllGroupsSettingsRow
            settings={allGroupsSettings}
            updateAllGroups={this.updateAllGroupsAlert} />
          {memberships.map(membership => <MembershipSettingsRow
            key={membership.id}
            membership={membership}
            updateMembershipSettings={changes => updateMembershipSettings(membership.group.id, changes)} />)}
        </div>

        <div styleName='help'>
          <p styleName='help-paragraph'>
            Download our <a href={iOSAppURL} target='_blank'>iOS</a>&nbsp;
            or <a href={androidAppURL} target='_blank'>Android</a> app to
            receive push notifications.
          </p>
        </div>

        <Tooltip
          delay={250}
          id='helpTip'
          position='top'
        />
      </div>
    )
  }
}

export function MessageSettingsRow ({ settings, updateMessageSettings }) {
  return <SettingsRow
    iconName='Messages'
    name='Direct Messages'
    settings={settings}
    update={updateMessageSettings}
  />
}

export function AllGroupsSettingsRow ({ settings, updateAllGroups }) {
  return <SettingsRow
    imageUrl={allGroupsLogo}
    name='All Groups'
    settings={settings}
    update={updateAllGroups} />
}

export function MembershipSettingsRow ({ membership, updateMembershipSettings }) {
  return <SettingsRow
    imageUrl={membership.group.avatarUrl}
    name={membership.group.name}
    settings={membership.settings}
    update={updateMembershipSettings} />
}

export class SettingsRow extends React.Component {
  render () {
    const { iconName, imageUrl, name, settings, update } = this.props

    const imageStyle = bgImageStyle(imageUrl)

    return <div styleName={cx('settingsRow')}>
      <div styleName='nameRow'>
        {iconName && <Icon name={iconName} styleName='avatarIcon' />}
        {!iconName && <div styleName='groupAvatar' style={imageStyle} />}
        <span styleName='name'>{name}</span>
      </div>
      <div styleName='iconRow'>
        <SettingsIcon settingKey='sendPushNotifications' name='PushNotification' settings={settings} update={update} />
        <SettingsIcon settingKey='sendEmail' name='EmailNotification' settings={settings} update={update} />
      </div>
    </div>
  }
}

export function SettingsIcon ({ settingKey, name, update, settings }) {
  const settingStatus = settings[settingKey] ? 'On' : 'Off'

  return (
    <div
      styleName={cx('setting-controls', { highlightIcon: settings[settingKey] })}
      onClick={() => update({ [settingKey]: !settings[settingKey] })}
      data-tip={`Turn ${name === 'EmailNotification' ? 'Email' : 'Mobile Push'} Notifications ${settings[settingKey] ? 'Off' : 'On'}`}
      data-for='helpTip'
    >
      <Icon name={name} styleName={cx('icon', { highlightIcon: settings[settingKey] })} />
      <span styleName='setting-status'>{settingStatus}</span>
    </div>
  )
}
