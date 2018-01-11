import React from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_AVATAR } from 'store/models/Community'
import RoundImage from 'components/RoundImage'
import './RemovableListItem.scss'

export default function RemovableListItem ({ item, removeItem, square, size, confirmMessage, url }) {
  const remove = () => {
    confirmMessage = confirmMessage || `Are you sure you want to remove ${item.name}?`
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

    {removeItem && <span onClick={remove} styleName='remove-button'>Remove</span>}
  </div>
}
