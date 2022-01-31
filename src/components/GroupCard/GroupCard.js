import React from 'react'
import cx from 'classnames'
import './GroupCard.scss'
import GroupHeader from './GroupHeader'
import { Link } from 'react-router-dom'
import { bgImageStyle } from 'util/index'
import { groupUrl, groupDetailUrl } from 'util/navigation'

/* 
  Each card needs
  - group title
  - group icon
  - group background (tiny, behind the group icon)
  - member sample (for avatars on right )
  - group geography descriptor (indigenous territory, location)

  Then is contents changed based on group type... perhaps passed in as a Content component
  Default for normie groups is Topics, and if no topics, pass in description

*/

export default function GroupCard ({ group = {}, routeParams = {}, highlightProps = {}, className, expanded = false, constrained = false, onClick = () => {} }) {
  
  return <Link to={group.memberStatus === 'member' ? groupUrl(group.slug, 'groups') : groupDetailUrl(group.slug, routeParams)} styleName='group-link'>
    <div
      onClick={onClick}
      styleName={cx('card', { expanded }, { constrained })}
      className={className}>
      <GroupHeader
        {...group}
        routeParams={routeParams}
        highlightProps={highlightProps}
        constrained={constrained} />
    </div>
  </Link>
}
