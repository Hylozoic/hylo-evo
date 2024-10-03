import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Loading from 'components/Loading'
import Button from 'components/Button'
import fetch from 'isomorphic-fetch'
import { getHost } from 'store/middleware/apiMiddleware'
import classes from './ExportDataTab.module.scss'

export default function ExportDataTab (props) {
  const [clicked, setClicked] = useState(false)
  const [status, setStatus] = useState(null)
  const group = props.group
  const { t } = useTranslation()

  const success = () => setStatus(t('You should receive an email with the member export in a few minutes'))
  const failure = () => {
    setClicked(false)
    setStatus(t('Oh no, something went wrong! Check your internet connection and try again'))
  }
  const handleClick = (e) => {
    e.preventDefault()
    setClicked(true)
    triggerMemberExport(group.id, success, failure)
  }

  if (!group) return <Loading />

  return (
    <div>
      <div className={classes.title}>{t('Export Data')}</div>
      <p className={classes.help}>{t('This function exports all member data for this group as a CSV file for import into other software.')}</p>
      {status && <p>{status}</p>}
      <Button disabled={clicked} label={t('Export Members')} color='green' onClick={handleClick} />
    </div>)
}

function triggerMemberExport (groupId, success, failure) {
  fetch(`${getHost()}/noo/export/group?groupId=${groupId}&datasets[]=members`)
    .then((res) => {
      let { status } = res
      status === 200 ? success() : failure()
    })
}
