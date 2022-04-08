import React from 'react'
import Icon from 'components/Icon'
import './FancyLink.scss'

export default function FancyLink ({ linkUrl, title = '', description = '', iconName }) {
  return (
    <a href={linkUrl} styleName='fancy-link-container'>
      <Icon styleName='icon' name={iconName} />
      <div styleName='text-container'>
        <h4>{title}</h4>
        <div styleName='url'>{linkUrl}</div>
        <div styleName='description'>{description}</div>
      </div>
    </a>
  )
}
