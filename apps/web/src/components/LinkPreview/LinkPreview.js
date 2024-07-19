import React from 'react'
import { bgImageStyle } from 'util/index'
import './LinkPreview.scss'

export default function LinkPreview ({ className, title, url, imageUrl, description }) {
  const domain = url && new URL(url).hostname.replace('www.', '')

  return (
    <a styleName='container' className={className} href={url} target='_blank' rel='noreferrer'>
      <div styleName='link-preview'>
        {imageUrl && <div style={bgImageStyle(imageUrl)} styleName='image' />}
        <div styleName='text'>
          <div styleName='title'>{title}</div>
          <div styleName='description'>{description}</div>
          <div styleName='domain'>{domain}</div>
        </div>
      </div>
    </a>
  )
}
