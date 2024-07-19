import React from 'react'
import { bgImageStyle } from 'util/index'
import './ExplorerBanner.scss'
import { explorerBannerSvg } from 'util/assets'

export default function ExplorerBanner () {
  const name = 'Group Explorer'
  const bannerUrl = explorerBannerSvg

  return <div styleName={'banner'}>
    <div style={bgImageStyle(bannerUrl)} styleName='image'>
      <div styleName='fade' />
      <div styleName='header'>
        <div styleName='header-text'>
          <div styleName='header-contents'>
            <span styleName='header-name'>{name}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
}
