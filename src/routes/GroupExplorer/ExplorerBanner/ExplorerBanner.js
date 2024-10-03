import React from 'react'
import { bgImageStyle } from 'util/index'
import { explorerBannerSvg } from 'util/assets'
import classes from './ExplorerBanner.module.scss'

export default function ExplorerBanner () {
  const name = 'Group Explorer'
  const bannerUrl = explorerBannerSvg

  return <div className={classes.banner}>
    <div style={bgImageStyle(bannerUrl)} className={classes.image}>
      <div className={classes.fade} />
      <div className={classes.header}>
        <div className={classes.headerText}>
          <div className={classes.headerContents}>
            <span className={classes.headerName}>{name}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
}
