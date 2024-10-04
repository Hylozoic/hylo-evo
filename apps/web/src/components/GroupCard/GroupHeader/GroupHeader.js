import React from 'react'
import cx from 'classnames'
import classes from './GroupHeader.module.scss'
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
  return <div className={cx(classes.header, { [classes.constrained]: constrained })} >
    <div style={bgImageStyle(group.bannerUrl || DEFAULT_BANNER)} className={classes.groupCardBackground}><div /></div>
    <div className={classes.headerMainRow}>
      <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} className={classes.groupImage} size='50px' />
      <div className={classes.groupLabel}>
        <div className={classes.groupTitle}>{group.name}
        </div>
        <div className={classes.groupGeoDescriptor}>
          {group.location}
        </div>
      </div>
      <div className={classes.groupMemberFlavor}>
        <RoundImageRow
          imageUrls={avatarUrls.slice(0, 3)}
          inline
          className={classes.people}
          blue
          count={group.memberCount}
        />
      </div>
    </div>
  </div>
}
