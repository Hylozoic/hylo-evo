import React from 'react'
import { trim } from 'lodash/fp'
import ReactPlayer from 'react-player'
import './GroupAboutVideoEmbed.scss'

export default function GroupAboutVideoEmbed ({ uri, className }) {
  if (!uri || trim(uri).length === 0) return null

  return (
    <div styleName='videoContainer' className={className}>
      <ReactPlayer
        url={uri}
        controls
        width='100%'
        height='100%'
        styleName='video'
      />
    </div>
  )
}
