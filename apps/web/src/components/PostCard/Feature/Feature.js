import React from 'react'
import ReactPlayer from 'react-player'
import './Feature.scss'

export default function Feature ({ url }) {
  return (
    <ReactPlayer
      url={url}
      controls
      width='100%'
      styleName='video'
    />
  )
}
