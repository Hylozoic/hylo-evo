import React from 'react'
import { Link } from 'react-router-dom'
import RoundImage from 'components/RoundImage'
import { personUrl } from 'util/index'
import './RemovableListItem.scss'

export default function RemovableListItem ({ item, slug, removeModerator, square, size, confirmMessage }) {
  const remove = () => {
    confirmMessage = confirmMessage || `Are you sure you want to remove ${item.name}'s moderator powers?`
    if (window.confirm(confirmMessage)) {
      removeModerator(item.id)
    }
  }

  return <div styleName='item'>
    <Link to={personUrl(item.id, slug)}>
      <RoundImage url={item.avatarUrl} medium square={square} size={size} styleName='avatar' />
    </Link>
    <Link to={personUrl(item.id, slug)} styleName='name'>{item.name}</Link>
    {removeModerator && <span onClick={remove} styleName='remove-button'>Remove</span>}
  </div>
}
