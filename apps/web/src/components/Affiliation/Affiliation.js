import React from 'react'
import { useTranslation } from 'react-i18next'
import classes from './Affiliation.module.scss'

export default function Affiliation ({ affiliation, index, archive }) {
  const { role, preposition, orgName, url } = affiliation
  const { t } = useTranslation()

  const leave = () => {
    if (window.confirm(t('Are you sure you want to delete your affiliation as {{affiliation.role}} {{affiliation.preposition}} {{affiliation.orgName}}?', { affiliation }))) {
      archive(affiliation.id)
    }
  }

  return (
    <div className={`${classes.affiliation} ${index % 2 === 0 ? classes.even : classes.odd}`}>
      <div className={classes.role}>{role}</div>
      <div>{preposition}</div>
      <div className={classes.orgName}>{url ? (<a href={url} target='new'>{orgName}</a>) : orgName}</div>

      {archive && <span onClick={leave} className={classes.leaveButton}>{t('Delete')}</span>}
    </div>
  )
}
