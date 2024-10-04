import React from 'react'
import ReactPlayer from 'react-player'
import classes from './Feature.module.scss'

export default function Feature ({ url }) {
  return (
    <ReactPlayer
      url={url}
      controls
      width='100%'
      className={classes.video}
    />
  )
}
