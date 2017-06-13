import React, { PropTypes, Component } from 'react'
import './NotificationSettings.scss'
import Icon from 'components/Icon'
// import Loading from 'components/Loading'
// import cx from 'classnames'
const { object, func } = PropTypes

export default class NotificationSettings extends Component {
  static propTypes = {
    currentUser: object,
    updateUserSettings: func
  }

  render () {
    const { currentUser, updateUserSettings } = this.props

    // const { settings } = currentUser

    const settings = {
      digest_frequency: 'weekly'
    }

    const updateSetting = setting => value => {
      updateUserSettings({settings: {[setting]: value}})
    }

    return <div>
      <div styleName='title'>Notifications</div>
      <div styleName='prompt'>How often would you like to receive email digests
        for new posts in your communities?</div>
      <Select
        onChange={updateSetting('digest_frequency')}
        selected={settings['digest_frequency']}
        options={[
          {id: 'daily', label: 'Daily'},
          {id: 'weekly', label: 'Weekly'},
          {id: 'never', label: 'Never'}
        ]} />
      <div styleName='prompt'>How would you like to receive notifications about
        new direct messages?</div>
      <Select
        onChange={updateSetting('dm_notifications')}
        selected={settings['dm_notifications']}
        options={[
          {id: 'none', label: 'None'},
          {id: 'email', label: 'Email'},
          {id: 'push', label: 'Mobile App'},
          {id: 'both', label: 'Both'}
        ]} />
      <div styleName='prompt'>How would you like to receive notifications about
      new comments on posts you're following?</div>
      <Select
        onChange={updateSetting('comment_notifications')}
        selected={settings['comment_notifications']}
        options={[
          {id: 'none', label: 'None'},
          {id: 'email', label: 'Email'},
          {id: 'push', label: 'Mobile App'},
          {id: 'both', label: 'Both'}
        ]} />
    </div>
  }
}

export function Select ({ options, selected, onChange }) {
  return <span styleName='select-wrapper'>
    <select styleName='select' onChange={e => onChange(e.target.value)}>
      {options.map(({id, label}) => <option value={id} selected={id === selected}>
        {label}
      </option>)}
    </select>
    <Icon name='ArrowDown' styleName='icon' />
  </span>
}
