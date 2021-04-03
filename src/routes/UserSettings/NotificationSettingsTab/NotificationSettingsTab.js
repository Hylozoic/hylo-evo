import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './NotificationSettingsTab.scss'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import { compact } from 'lodash/fp'
import Select from 'components/Select'
import { bgImageStyle } from 'util/index'
import cx from 'classnames'

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
    var dmNotifications
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

    return <div>
      <div styleName='title'>Notifications</div>
      <div styleName='prompt'>How often would you like to receive email digests
        for new posts in your groups and saved searches?</div>
      <Select
        onChange={updateSetting('digestFrequency')}
        selected={settings['digestFrequency']}
        options={[
          { id: 'daily', label: 'Daily' },
          { id: 'weekly', label: 'Weekly' },
          { id: 'never', label: 'Never' }
        ]} />

      <div styleName='prompt'>How would you like to receive notifications about
      new comments on posts you're following?</div>
      <Select
        onChange={updateSetting('commentNotifications')}
        selected={getSetting('commentNotifications')}
        options={notificationOptions} />

      <div>
        <MessageSettingsRow
          settings={messageSettings}
          updateMessageSettings={this.updateMessageSettings} />
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
    </div>
  }
}

export function MessageSettingsRow ({ settings, updateMessageSettings }) {
  return <SettingsRow
    iconName='Messages'
    name='Messages'
    settings={settings}
    update={updateMessageSettings} />
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
  state = {
    expanded: false
  }

  toggleExpand = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { iconName, imageUrl, name, settings, update } = this.props
    const { expanded } = this.state

    const imageStyle = bgImageStyle(imageUrl)

    return <div styleName={cx('settingsRow', { expanded })}>
      <div styleName='nameRow'>
        {iconName && <Icon name={iconName} styleName='avatarIcon' />}
        {!iconName && <div styleName='groupAvatar' style={imageStyle} />}
        <span styleName='name'>{name}</span>
        <Icon name={expanded ? 'ArrowUp' : 'ArrowDown'} styleName='arrowIcon' onClick={this.toggleExpand} />
      </div>
      {expanded && <div styleName='iconRow'>
        <SettingsIcon settingKey='sendPushNotifications' name='PushNotification' settings={settings} update={update} />
        <SettingsIcon settingKey='sendEmail' name='EmailNotification' settings={settings} update={update} />
      </div>}
    </div>
  }
}

export function SettingsIcon ({ settingKey, name, update, settings }) {
  return <Icon name={name}
    styleName={cx('icon', { highlightIcon: settings[settingKey] })}
    onClick={() => update({ [settingKey]: !settings[settingKey] })} />
}
