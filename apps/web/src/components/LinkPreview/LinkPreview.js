import cx from 'classnames'
import React from 'react'
import { bgImageStyle } from 'util/index'
import classes from './LinkPreview.module.scss'

export default function LinkPreview ({ className, title, url, imageUrl, description }) {
  const domain = url && new URL(url).hostname.replace('www.', '')

  return (
    <a className={cx(classes.container, className)} href={url} target='_blank' rel='noreferrer'>
      <div className={classes.linkPreview}>
        {imageUrl && <div style={bgImageStyle(imageUrl)} className={classes.image} />}
        <div className={classes.text}>
          <div className={classes.title}>{title}</div>
          <div className={classes.description}>{description}</div>
          <div className={classes.domain}>{domain}</div>
        </div>
      </div>
    </a>
  )
}
