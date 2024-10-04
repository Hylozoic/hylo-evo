import cx from 'classnames'
import React from 'react'
import { trim } from 'lodash/fp'
import ReactPlayer from 'react-player'
import classes from './GroupAboutVideoEmbed.module.scss'

export default function GroupAboutVideoEmbed ({ uri, className }) {
  if (!uri || trim(uri).length === 0) return null

  return (
    <div className={cx(classes.videoContainer, className)}>
      <ReactPlayer
        url={uri}
        controls
        width='100%'
        height='100%'
        className={classes.video}
      />
    </div>
  )
}
