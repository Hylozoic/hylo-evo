import React from 'react'
import Icon from 'components/Icon'
import './ChangeImageButton.scss'

export default function ChangeImageButton (props) {
  const { upload, loading, className, children, disable } = props
  const iconName = loading ? 'Clock' : 'AddImage'
  const onClick = loading || disable ? () => {} : upload

  if (children) return <div onClick={onClick} className={className}>{children}</div>
  return <div styleName='button' onClick={onClick} className={className}>
    <Icon name={iconName} styleName='icon' />
  </div>
}
