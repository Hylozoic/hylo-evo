import cx from 'classnames'
import { isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import useRouterParams from 'hooks/useRouterParams'

import Button from 'components/Button'
import CheckBox from 'components/CheckBox'
import Select from 'components/Select'
import fetchNotificationSettings from 'store/actions/fetchNotificationSettings'
import updateNotificationSettings from 'store/actions/updateNotificationSettings'

import styles from './ManageNotifications.module.scss'

export default function ManageNotifications (props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const routerParams = useRouterParams()
  const userName = routerParams.name
  const token = routerParams.token

  const [settings, setSettings] = useState({ allGroupNotifications: 'keep' })
  const [unsubscribeAll, setUnsubscribeAll] = useState(false)

  const { commentNotifications, dmNotifications, digestFrequency, postNotifications, allGroupNotifications } = settings

  useEffect(() => {
    dispatch(fetchNotificationSettings(token)).then((data) => setSettings(data.payload))
  }, [])

  const updateSetting = setting => value => {
    setSettings({ ...settings, [setting]: value })
  }

  const submit = () => {
    dispatch(updateNotificationSettings(token, unsubscribeAll, digestFrequency, dmNotifications, commentNotifications, postNotifications, allGroupNotifications))
  }

  const notificationOptions = [
    { id: 'none', label: t('None') },
    { id: 'email', label: t('Email') },
    { id: 'push', label: t('Mobile App') },
    { id: 'both', label: t('Email & Mobile App') }
  ]

  const groupNotificationOptions = [{ id: 'keep', label: t('Existing per Group Settings') }, ...notificationOptions]

  return (
    <div className={cx(props.className, styles.wrapper)}>
      <h1>{t('Hi {{userName}}', { userName })}</h1>
      <p>{t('You can change your Hylo notification settings here')}</p>
      {isEmpty(settings)
        ? t('Loading...')
        : (
          <div className={styles.formWrapper}>
            <div className={styles.settingWrapper}>
              <label className={styles.settingExplanation}>{t('Send me a digest of new posts')}</label><br />
              <Select
                disabled={unsubscribeAll}
                onChange={updateSetting('digestFrequency')}
                options={[
                  { id: 'daily', label: t('Daily') },
                  { id: 'weekly', label: t('Weekly') },
                  { id: 'never', label: t('Never') }
                ]}
                selected={unsubscribeAll ? 'never' : digestFrequency}
              />
            </div>
            <div className={styles.settingWrapper}>
              <label className={styles.settingExplanation}>{t('Send notifications for each new post in your group?')}</label>
              <Select
                disabled={unsubscribeAll}
                onChange={updateSetting('postNotifications')}
                options={[
                  { id: 'none', label: t('No Posts') },
                  { id: 'important', label: t('Announcements & Mentions only') },
                  { id: 'all', label: t('Every Post') }
                ]}
                selected={unsubscribeAll ? 'none' : postNotifications}
              />
            </div>
            <div className={styles.settingWrapper}>
              <label className={styles.settingExplanation}>{t('Send notifications about comments on posts you are following via')}</label>
              <Select
                disabled={unsubscribeAll}
                onChange={updateSetting('commentNotifications')}
                options={notificationOptions}
                selected={unsubscribeAll ? 'none' : commentNotifications}
              />
            </div>
            <div className={styles.settingWrapper}>
              <label className={styles.settingExplanation}>{t('Send notifications for direct messages via')}</label>
              <Select
                disabled={unsubscribeAll}
                onChange={updateSetting('dmNotifications')}
                options={notificationOptions}
                selected={unsubscribeAll ? 'none' : dmNotifications}
              />
            </div>

            <div className={styles.settingWrapper}>
              <label className={styles.settingExplanation}>{t('Send notifications for announcements and topic posts for all my groups via')}</label>
              <Select
                disabled={unsubscribeAll}
                onChange={updateSetting('allGroupNotifications')}
                options={groupNotificationOptions}
                selected={unsubscribeAll ? 'none' : allGroupNotifications}
              />
            </div>

            <CheckBox
              checked={unsubscribeAll}
              label={t('Unsubscribe from all')}
              onChange={value => setUnsubscribeAll(value)}
              labelClass={styles.unsubscribeAllLabel}
            />

            <Button
              className={styles.submit}
              label={t('Save Settings')}
              color='green'
              onClick={submit}
            />
          </div>)}
    </div>
  )
}
