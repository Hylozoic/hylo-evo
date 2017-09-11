import React from 'react'
import './ModalSidebar.scss'
import { bgImageStyle } from 'util/index'

export default function ModalSidebar ({theme = {}, header, body, onClick, secondParagraph, imageUrl, imageStyle}) {
  console.log('ModalSidebar imageUrl', imageUrl)
  return <div styleName={'sidebar'}>
    <p styleName='gray-text close-button' onClick={onClick}>CLOSE</p>
    <p styleName={theme.sidebarHeader || 'sidebar-header'}>{header}</p>
    <p styleName={theme.sidebarText || 'gray-text sidebar-text'}>{body}</p>
    {secondParagraph && <p styleName={theme.sidebarText || 'gray-text sidebar-text'}>{secondParagraph}</p>}
    {imageUrl && <div style={bgImageStyle(imageUrl)} styleName='sidebar-image' />}
  </div>
}
