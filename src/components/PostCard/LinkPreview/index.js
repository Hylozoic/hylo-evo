import { bgImageStyle } from 'util/index'
import { parse } from 'url'
import React from 'react'
import './LinkPreview.scss'

export default function LinkPreview ({ title, url, imageUrl }) {
  const domain = url && parse(url).hostname.replace('www.', '')
  return <div styleName='wrapper'>
    <div styleName='linkPreview'>
      <a href={url} target='_blank'>
        <div style={bgImageStyle(imageUrl)} styleName='previewImage' />
        <div styleName='previewText'>
          <span styleName='previewTitle'>{title}</span>
          <div styleName='previewDomain'>{domain}</div>
        </div>
      </a>
    </div>
  </div>
}
