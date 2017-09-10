import React from 'react'
import './ModalSidebar.scss'

export default function ModalSidebar ({theme = {}, header, body, onClick}) {
  return <div styleName={'sidebar'}>
    <p styleName='gray-text close-button' onClick={onClick}>CLOSE</p>
    <p styleName={theme.sidebarHeader || 'sidebar-header'}>{header}</p>
    <p styleName={theme.sidebarText || 'gray-text sidebar-text'}>{body}</p>
  </div>
}
