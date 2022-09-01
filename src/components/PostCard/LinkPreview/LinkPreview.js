import React from 'react'
import { bgImageStyle } from 'util/index'
import { parse } from 'url'
import './LinkPreview.scss'

export default function LinkPreview ({ title, url, imageUrl, description }) {
  const domain = url && parse(url).hostname.replace('www.', '')

  return (
    <a styleName='container' href={url} target='_blank' rel='noreferrer'>
      {imageUrl && <div style={bgImageStyle(imageUrl)} styleName='image' />}
      <div styleName='text'>
        <div styleName='title'>{title}</div>
        <div styleName='description'>{description}</div>
        <div styleName='domain'>{domain}</div>
      </div>
    </a>
  )
}
