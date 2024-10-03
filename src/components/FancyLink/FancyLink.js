import React from 'react'
import Icon from 'components/Icon'
import classes from './FancyLink.module.scss'

export default function FancyLink ({ linkUrl, title = '', description = '', iconName, target = null }) {
  return (
    <a href={linkUrl} target={target} className={classes.fancyLinkContainer}>
      <Icon className={classes.icon} name={iconName} />
      <div className={classes.textContainer}>
        <h4>{title}</h4>
        <div className={classes.url}>{linkUrl}</div>
        <div className={classes.description}>{description}</div>
      </div>
    </a>
  )
}
