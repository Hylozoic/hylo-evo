import React from 'react'
import { Link } from 'react-router-dom'
import RoundImage from 'components/RoundImage'
import { personUrl } from 'util/index'
import './RemovableListItem.scss'

export default function RemovableListItem ({ item, slug, removeItem, square, size, confirmMessage }) {
  const remove = () => {
    confirmMessage = confirmMessage || `Are you sure you want to remove ${item.name}?`
    if (window.confirm(confirmMessage)) {
      removeItem(item.id)
    }
  }

  return <div styleName='item'>
    <Link to={personUrl(item.id, slug)}>
      <RoundImage url={item.avatarUrl} medium square={square} size={size} styleName='avatar' />
    </Link>
    <Link to={personUrl(item.id, slug)} styleName='name'>{item.name}</Link>
    {removeItem && <span onClick={remove} styleName='remove-button'>Remove</span>}
  </div>
}
