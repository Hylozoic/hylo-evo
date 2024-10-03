import React from 'react'
import { bgImageStyle } from 'util/index'
import { groupUrl } from 'util/navigation'
import { Link } from 'react-router-dom'
import { chunk } from 'lodash/fp'
import { DEFAULT_AVATAR } from 'store/models/Group'
import classes from './GroupsList.module.scss'

export default function GroupsList ({ groups }) {
  return chunk(2, groups).map(pair => <GroupRow groups={pair} key={pair[0].id} />)
}

export function GroupRow ({ groups }) {
  return (
    <div className={classes.groupRow}>
      {groups.map(group => <GroupCell key={group.id} group={group} />)}
    </div>
  )
}

export function GroupCell ({ group, children }) {
  const { name, avatarUrl } = group
  const imageStyle = bgImageStyle(avatarUrl || DEFAULT_AVATAR)

  return (
    <>
      <Link to={groupUrl(group.slug)} className={classes.groupCell}>
        <div className={classes.groupCellAvatar} style={imageStyle} />
        <span className={classes.groupCellName}>{name}</span>
      </Link>
      {children}
    </>
  )
}
