import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DEFAULT_AVATAR } from 'store/models/Group'
import RoundImage from 'components/RoundImage'
import './RemovableListItem.scss'

export default function RemovableListItem ({ item, removeItem, skipConfirm = false, square, size, confirmMessage, url }) {
  const { t } = useTranslation()
  const remove = () => {
    if (skipConfirm) return removeItem(item.id)

    confirmMessage = confirmMessage || t('Are you sure you want to remove {{item.name}}?', { item })
    if (window.confirm(confirmMessage)) {
      removeItem(item.id)
    }
  }

  const avatar = <RoundImage url={item.avatarUrl || DEFAULT_AVATAR} medium square={square} size={size} styleName='avatar' />
  const title = item.name

  return <div styleName='item'>
    {url && <Link to={url}>
      {avatar}
    </Link>}
    {!url && avatar}

    {url && <Link to={url} styleName='name'>{title}</Link>}
    {!url && <span>{title}</span>}

    {removeItem && <span onClick={remove} className='remove-button' styleName='remove-button'>{t('Remove')}</span>}
  </div>
}
