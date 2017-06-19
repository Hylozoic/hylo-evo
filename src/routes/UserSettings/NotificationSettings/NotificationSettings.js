import React, { PropTypes, Component } from 'react'
import './NotificationSettings.scss'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import { Link } from 'react-router-dom'
// import cx from 'classnames'
const { object, func } = PropTypes

const iOSAppURL = 'https://itunes.apple.com/app/appName/id1002185140'
const androidAppURL = 'https://play.google.com/store/apps/details?id=com.hylo.hyloandroid'

export default class NotificationSettings extends Component {
  static propTypes = {
    currentUser: object,
    updateUserSettings: func
  }

  render () {
    const { currentUser, updateUserSettings } = this.props

    if (!currentUser) return <Loading />

    const { settings } = currentUser

    const updateSetting = setting => value => {
      updateUserSettings({settings: {[setting]: value}})
    }

    return <div>
      <div styleName='title'>Notifications</div>
      <div styleName='prompt'>How often would you like to receive email digests
        for new posts in your communities?</div>
      <Select
        onChange={updateSetting('digestFrequency')}
        selected={settings['digestFrequency']}
        options={[
          {id: 'daily', label: 'Daily'},
          {id: 'weekly', label: 'Weekly'},
          {id: 'never', label: 'Never'}
        ]} />
      <div styleName='prompt'>How would you like to receive notifications about
        new direct messages?</div>
      <Select
        onChange={updateSetting('dmNotifications')}
        selected={settings['dmNotifications']}
        options={[
          {id: 'none', label: 'None'},
          {id: 'email', label: 'Email'},
          {id: 'push', label: 'Mobile App'},
          {id: 'both', label: 'Both'}
        ]} />
      <div styleName='prompt'>How would you like to receive notifications about
      new comments on posts you're following?</div>
      <Select
        onChange={updateSetting('commentNotifications')}
        selected={settings['commentNotifications']}
        options={[
          {id: 'none', label: 'None'},
          {id: 'email', label: 'Email'},
          {id: 'push', label: 'Mobile App'},
          {id: 'both', label: 'Both'}
        ]} />
      <div styleName='help'>
        <p styleName='help-paragraph'>
          Download our <a href={iOSAppURL} target='_blank'>iOS</a>&nbsp;
          or <a href={androidAppURL} target='_blank'>Android</a> app to
          receive push notifications.
        </p>
        <p styleName='help-paragraph'>
          See the <Link to='/settings/communities' replace>Communities</Link> section
          to change notifications for an individual community.
        </p>
      </div>
    </div>
  }
}

export function Select ({ options, selected, onChange }) {
  return <span styleName='select-wrapper'>
    <select styleName='select' onChange={e => onChange(e.target.value)} value={selected}>
      {options.map(({id, label}) => <option value={id} key={id}>
        {label}
      </option>)}
    </select>
    <Icon name='ArrowDown' styleName='icon' />
  </span>
}
