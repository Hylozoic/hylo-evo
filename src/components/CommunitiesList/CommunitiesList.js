import React from 'react'
import { bgImageStyle } from 'util/index'
import { communityUrl } from 'util/navigation'
import { Link } from 'react-router-dom'
import { chunk } from 'lodash/fp'
import { DEFAULT_AVATAR } from 'store/models/Community'
import './CommunitiesList.scss'

export default function CommunitiesList ({ communities }) {
  return chunk(2, communities).map(pair => <CommunityRow communities={pair} key={pair[0].id} />)
}

export function CommunityRow ({ communities }) {
  return <div styleName='communityRow'>
    {communities.map(community => <CommunityCell key={community.id} community={community} />)}
  </div>
}

export function CommunityCell ({ community, children }) {
  const { name, avatarUrl } = community
  const imageStyle = bgImageStyle(avatarUrl || DEFAULT_AVATAR)

  return <React.Fragment>
    <Link to={communityUrl(community.slug)} styleName='communityCell'>
      <div styleName='communityCellAvatar' style={imageStyle} />
      <span styleName='communityCellName'>{name}</span>
    </Link>
    {children}
  </React.Fragment>
}
