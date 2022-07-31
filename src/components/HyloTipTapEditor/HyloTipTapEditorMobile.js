import React, { useCallback, useEffect, useRef } from 'react'
import { WebViewMessageTypes } from 'hylo-shared'
import { sendMessageToWebView } from 'util/webView'
import useRouter from 'hooks/useRouter'
import HyloTipTapEditor from 'components/HyloTipTapEditor'
import './HyloTipTapEditor.scss'

export default function HyloTipTapEditorMobile (props) {
  const { query } = useRouter()
  const editorRef = useRef()
  const hideMenu = query?.hideMenu
  const readOnly = query?.readOnly
  const placeholder = query?.placeholder

  // Sending Messages
  const handleChange = useCallback(contentHTML => {
    console.log('!!! onChange -- contentHTML', contentHTML)

    return sendMessageToWebView(WebViewMessageTypes.EDITOR.ON_CHANGE, contentHTML)
  })

  const handleEnter = useCallback(() =>
    sendMessageToWebView(WebViewMessageTypes.EDITOR.ON_ENTER, editorRef.current.getHTML())
  )

  const handleAddTopic = useCallback(topic => (
    sendMessageToWebView(WebViewMessageTypes.EDITOR.ON_ADD_TOPIC, topic)
  ))

  const handleMessage = message => {
    console.log('!!! handleMessage', editorRef.current, message.data)
    const { type, data } = JSON.parse(message.data)

    switch (type) {
      case WebViewMessageTypes.EDITOR.SET_CONTENT: {
        editorRef.current.setContent(data)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage.bind(this))

    return () => window.removeEventListener('message')
  }, [])

  return (
    <HyloTipTapEditor
      styleName='hylo-app-container'
      placeholder={placeholder}
      onChange={handleChange}
      onEnter={handleEnter}
      // onAddMention={handleAddMention}
      onAddTopic={handleAddTopic}
      // Should the default be empty or a paragraph?
      contentHTML
      readOnly={readOnly}
      hideMenu={hideMenu}
      ref={editorRef}
    />
  )
}
