import React from 'react'
import cx from 'classnames'
import './GroupHeader.scss'
import RoundImage from 'components/RoundImage'
import {
  DEFAULT_BANNER,
  DEFAULT_AVATAR
} from 'store/models/Group'
import { bgImageStyle } from 'util/index'
import RoundImageRow from 'components/RoundImageRow'

export default function GroupHeader ({ constrained = false, name, group }) {
  const members = group.members.toModelArray()
  const avatarUrls = members.map(member => member.avatarUrl)
  return <div styleName={cx('header', { constrained })} >
    <div style={bgImageStyle(group.bannerUrl || DEFAULT_BANNER)} styleName='group-card-background'><div /></div>
    <div styleName='header-main-row'>
      <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} styleName='group-image' size='50px' />
      <div styleName='group-label'>
        <div styleName='group-title'>{group.name}
        </div>
        <div styleName='group-geo-descriptor'>
          {group.location}
        </div>
      </div>
      <div styleName='group-member-flavor'><RoundImageRow imageUrls={avatarUrls.slice(0, 3)} inline styleName='people' blue count={group.memberCount} /></div>
    </div>
  </div>
}
