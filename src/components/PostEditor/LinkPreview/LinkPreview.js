import React, { PropTypes } from 'react'
import './LinkPreview.scss'
import { bgImageStyle } from 'util/index'
import Icon from 'components/Icon'

export default function LinkPreview ({ className, linkPreview, onClose }) {
  const { title, description, imageUrl } = linkPreview

  const imageStyle = bgImageStyle(imageUrl)

  return <div styleName='link-preview' className={className}>
    <div style={imageStyle} styleName='image' />
    <div styleName='text'>
      <div styleName='header'>
        <span styleName='title'>{title}</span>
        <span onClick={onClose} styleName='close'>
          <Icon name='Ex' styleName='icon' />
        </span>
      </div>
      <span styleName='description'>{description}</span>
    </div>
  </div>
}
LinkPreview.propTypes = {
  linkPreview: PropTypes.object.isRequired,
  className: PropTypes.string
}
