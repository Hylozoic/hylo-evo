import React from 'react'
import ReactPlayer from 'react-player'
import './GroupAboutVideoEmbed.scss'

export default function GroupAboutVideoEmbed ({ uri }) {
  if (!uri) return null

  return (
    <div styleName='videoContainer'>
      <ReactPlayer
        url={uri}
        styleName='video'
        width='100%'
        height='100%'
      />
    </div>
  )
}
