import React from 'react'
import cx from 'classnames'
import './GroupHeader.scss'
import RoundImage from 'components/RoundImage'
import {
  DEFAULT_BANNER,
  DEFAULT_AVATAR
} from 'store/models/Group'
import { bgImageStyle } from 'util/index'

export default function GroupHeader ({ avatarUrl, bannerUrl, constrained = false }) {
  return <div styleName={cx('header', { constrained })} >
    <div style={bgImageStyle(bannerUrl || DEFAULT_BANNER)} styleName='groupCardBackground'><div /></div>
    <div styleName='headerMainRow'>
      <RoundImage url={avatarUrl || DEFAULT_AVATAR} styleName='group-image' size='50px' />
      'yay'
    </div>
  </div>
}
