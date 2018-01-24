import React from 'react'
import './ModalSidebar.scss'
import { bgImageStyle } from 'utils/index'

export default function ModalSidebar ({
  theme = {},
  header,
  body,
  onClick,
  secondParagraph,
  imageUrl,
  imageStyle,
  imageDialogOne,
  imageDialogTwo
}) {
  return <div styleName={'sidebar'}>
    <p styleName='gray-text close-button' onClick={onClick}>CLOSE</p>
    <p styleName={theme.sidebarHeader || 'sidebar-header'}>{header}</p>
    <p styleName={theme.sidebarText || 'gray-text sidebar-text'}>{body}</p>
    {secondParagraph && <p styleName={theme.sidebarText || 'gray-text sidebar-text'}>{secondParagraph}</p>}
    {imageDialogOne && <div styleName='sidebar-dialog'>{imageDialogOne}</div>}
    {imageDialogTwo && <div styleName='sidebar-dialog-two'>{imageDialogTwo}</div>}
    {imageDialogOne && <div styleName='dialog-line' />}
    {imageUrl && <div style={bgImageStyle(imageUrl)} styleName='sidebar-image' />}
  </div>
}
