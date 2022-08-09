import React from 'react'
import { bgImageStyle } from 'util/index'
import { parse } from 'url'
import cx from 'classnames'
import './LinkPreview.scss'

export default function LinkPreview ({ title, url, imageUrl }) {
  const domain = url && parse(url).hostname.replace('www.', '')

  return (
    <div styleName='wrapper'>
      <div styleName={cx('linkPreview', { noImage: !imageUrl })}>
        <a href={url} target='_blank' rel='noreferrer'>
          {imageUrl && <div style={bgImageStyle(imageUrl)} styleName='previewImage' />}
          <div styleName='previewText'>
            <span styleName='previewTitle'>{title}</span>
            <div styleName='previewDomain'>{domain}</div>
          </div>
        </a>
      </div>
    </div>
  )
}
