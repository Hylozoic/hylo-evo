import React, { Component } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import cx from 'classnames'
import { compact } from 'lodash/fp'
import PropTypes from 'prop-types'
import Tooltip from 'components/Tooltip'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import Select from 'components/Select'
import { bgImageStyle } from 'util/index'

import classes from './NotificationSettingsTab.module.scss'

const allGroupsLogo = '/hylo-merkaba.png'

const { object, func } = PropTypes

const iOSAppURL = 'https://itunes.apple.com/app/appName/id1002185140'
const androidAppURL = 'https://play.google.com/store/apps/details?id=com.hylo.hyloandroid'

class NotificationSettingsTab extends Component {
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
    const { t } = this.props

    const key = ('sendEmail' in changes) ? 'sendEmail' : 'sendPushNotifications'

    const type = key === 'sendEmail' ? t('Email') : t('Push Notifications')
    const onOrOff = changes[key] ? t('ON') : t('OFF')
    const numGroups = this.props.memberships.length

    if (window.confirm(t('You wish to turn {{onOrOff}} {{type}} for all groups? This will affect {{numGroups}} {{groups}}.', { onOrOff, type, numGroups, groups: numGroups === 1 ? t('group') : t('groups') }))) {
      this.updateAllGroups(changes)
    }
  }

  render () {
    const {
      currentUser, updateUserSettings, memberships, updateMembershipSettings, allGroupsSettings,
      messageSettings, t
    } = this.props

    if (!currentUser) return <Loading />

    const { settings = {}, hasDevice } = currentUser

    const updateSetting = setting => value => {
      updateUserSettings({ settings: { [setting]: value } })
    }

    const notificationOptions = compact([
      { id: 'none', label: t('None') },
      { id: 'email', label: t('Email') },
      hasDevice && { id: 'push', label: t('Mobile App') },
      hasDevice && { id: 'both', label: t('Both') }
    ])

    const getSetting = setting => {
      if (!hasDevice && settings[setting] === 'both') return 'email'
      return settings[setting]
    }
    return (
      <div>
        <div className={classes.title}><Icon name='Notifications' />{t('Notifications')}</div>
        <div className={classes.globalSetting}>
          <div className={classes.prompt}>{t('How often would you like to receive email digests for new posts in your groups and saved searches?')}
          </div>
          <div className={classes.settingSelect}>
            <div className={classes.selectExplanation}>{t('Send me a digest')}</div>
            <Select
              onChange={updateSetting('digestFrequency')}
              selected={settings.digestFrequency}
              options={[
                { id: 'daily', label: t('Daily') },
                { id: 'weekly', label: t('Weekly') },
                { id: 'never', label: t('Never') }
              ]} />
          </div>
        </div>
        <div className={classes.globalSetting}>
          <div className={classes.prompt}>{t('Would you like to receive a notification for each new post in your groups?')}
          </div>
          <div className={classes.settingSelect}>
            <Select
              onChange={updateSetting('postNotifications')}
              selected={settings.postNotifications}
              options={[
                { id: 'none', label: t('No Posts') },
                { id: 'important', label: t('Important Posts (Announcements & Mentions)') },
                { id: 'all', label: t('Every Post') }
              ]} />
          </div>
        </div>
        <div className={classes.globalSetting}>
          <div className={classes.prompt}>
            {t('How would you like to receive notifications about')}&nbsp;
            {t('new comments on posts you\'re following?')}
          </div>
          <div className={classes.settingSelect}>
            <div className={classes.selectExplanation}>{t('Notify me via')}</div>

            <Select
              onChange={updateSetting('commentNotifications')}
              selected={getSetting('commentNotifications')}
              options={notificationOptions} />
          </div>
        </div>
        <div>
          <div className={classes.individualGroups}>{t('NOTIFICATIONS')}</div>

          <MessageSettingsRow
            settings={messageSettings}
            updateMessageSettings={this.updateMessageSettings} />

          <div className={classes.individualGroups}>{t('GROUP NOTIFICATIONS')}</div>

          <AllGroupsSettingsRow
            settings={allGroupsSettings}
            updateAllGroups={this.updateAllGroupsAlert} />
          {memberships.map(membership => <MembershipSettingsRow
            key={membership.id}
            membership={membership}
            updateMembershipSettings={changes => updateMembershipSettings(membership.group.id, changes)} />)}
        </div>

        <div className={classes.help}>
          <p className={classes.helpParagraph}>
            {t('Download our')}{' '}<a href={iOSAppURL} rel='noreferrer' target='_blank'>iOS</a>
            {' '}{t('or')}{' '}
            <a href={androidAppURL} rel='noreferrer' target='_blank'>Android</a>
            {t(' app to receive push notifications.')}
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
  const { t } = useTranslation()
  return (
    <SettingsRow
      iconName='Messages'
      name={t('Messages')}
      settings={settings}
      update={updateMessageSettings}
    />
  )
}

export function AllGroupsSettingsRow ({ settings, updateAllGroups }) {
  const { t } = useTranslation()
  return (
    <SettingsRow
      imageUrl={allGroupsLogo}
      name={t('All Groups')}
      settings={settings}
      update={updateAllGroups}
    />
  )
}

export function MembershipSettingsRow ({ membership, updateMembershipSettings }) {
  return (
    <SettingsRow
      imageUrl={membership.group.avatarUrl}
      name={membership.group.name}
      settings={membership.settings}
      update={updateMembershipSettings}
    />
  )
}

export class SettingsRow extends React.Component {
  render () {
    const { iconName, imageUrl, name, settings, update } = this.props

    const imageStyle = bgImageStyle(imageUrl)

    return (
      <div className={classes.settingsRow}>
        <div className={classes.nameRow}>
          {iconName && <Icon name={iconName} className={classes.avatarIcon} />}
          {!iconName && <div className={classes.groupAvatar} style={imageStyle} />}
          <span className={classes.name}>{name}</span>
        </div>
        <div className={classes.iconRow}>
          <SettingsIcon settingKey='sendPushNotifications' name='PushNotification' settings={settings} update={update} />
          <SettingsIcon settingKey='sendEmail' name='EmailNotification' settings={settings} update={update} />
        </div>
      </div>
    )
  }
}

export function SettingsIcon ({ settingKey, name, update, settings }) {
  const settingStatus = settings[settingKey] ? 'On' : 'Off'
  const { t } = useTranslation()

  return (
    <div
      className={cx(classes.settingControls, { [classes.highlightIcon]: settings[settingKey] })}
      onClick={() => update({ [settingKey]: !settings[settingKey] })}
      data-tooltip-content={`Turn ${name === 'EmailNotification' ? 'Email' : 'Mobile Push'} Notifications ${settings[settingKey] ? t('Off') : t('On')}`}
      data-tooltip-id='helpTip'
    >
      <Icon name={name} className={cx(classes.icon, { [classes.highlightIcon]: settings[settingKey] })} />
      <span className={classes.settingStatus}>{t(settingStatus)}</span>
    </div>
  )
}
export default withTranslation()(NotificationSettingsTab)
