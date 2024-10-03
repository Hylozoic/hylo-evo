import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DEFAULT_AVATAR } from 'store/models/Group'
import RoundImage from 'components/RoundImage'
import classes from './RemovableListItem.module.scss'

export default function RemovableListItem ({ item, removeItem, skipConfirm = false, square, size, confirmMessage, url }) {
  const { t } = useTranslation()
  const remove = () => {
    if (skipConfirm) return removeItem(item.id)

    confirmMessage = confirmMessage || t('Are you sure you want to remove {{item}}?', { item: item.name || item.title })
    if (window.confirm(confirmMessage)) {
      removeItem(item.id)
    }
  }

  const avatar = item.avatarUrl ? <RoundImage url={item.avatarUrl || DEFAULT_AVATAR} medium square={square} size={size} className={classes.avatar} /> : null
  const title = item.name || item.title

  return (
    <div className={classes.item}>
      {url && <Link to={url}>{avatar}</Link>}
      {!url && avatar}

      {url && <Link to={url} className={classes.name}>{title}</Link>}
      {!url && <span>{title}</span>}

      {removeItem && <span onClick={remove} className={classes.removeButton}>{t('Remove')}</span>}
    </div>
  )
}
