import React from 'react'
import { Link } from 'react-router-dom'
import RoundImage from 'components/RoundImage'
import { personUrl } from 'util/index'
import './ModeratorControl.scss'

export default function ModeratorControl ({ moderator, slug, removeModerator }) {
  const remove = () => {
    if (window.confirm(`Are you sure you want to remove ${moderator.name}'s moderator powers?`)) {
      removeModerator(moderator.id)
    }
  }
  return <div styleName='moderator-control'>
    <Link to={personUrl(moderator.id, slug)}>
      <RoundImage url={moderator.avatarUrl} medium styleName='avatar' />
    </Link>
    <Link to={personUrl(moderator.id, slug)} styleName='name'>{moderator.name}</Link>
    {removeModerator && <span onClick={remove} styleName='remove-button'>Remove</span>}
  </div>
}
