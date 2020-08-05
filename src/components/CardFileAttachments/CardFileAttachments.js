import React from 'react'
import path from 'path'
import { filter } from 'lodash/fp'
import Icon from 'components/Icon'
import './CardFileAttachments.scss'

export default function CardFileAttachments ({
  attachments = [],
  className
}) {
  const fileAttachments = filter({ type: 'file' }, attachments)

  return <div styleName='file-attachments' className={className}>
    {fileAttachments.map((fileAttachment, i) =>
      <CardFileAttachment fileAttachment={fileAttachment} key={i} />)}
  </div>
}

export function CardFileAttachment ({
  fileAttachment = {}
}) {
  return <a styleName='file-attachment'
    href={fileAttachment.url}
    target='_blank'
    key={fileAttachment.id}>
    <Icon name='Document' styleName='file-icon' />
    <span styleName='file-name'>{decodeURIComponent(path.basename(fileAttachment.url))}</span>
  </a>
}
