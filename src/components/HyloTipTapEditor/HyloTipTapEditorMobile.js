import React, { useState, useCallback, useEffect, useRef } from 'react'
import { pickBy } from 'lodash/fp'
import { WebViewMessageTypes } from 'hylo-shared'
import { sendMessageToWebView } from 'util/webView'
import HyloTipTapEditor from 'components/HyloTipTapEditor'
import './HyloTipTapEditor.scss'

// Note: This Mobile editor can be tested in a browser at `hyloApp/editor`.
//       To control the editor manually post messages via the Web Console, e.g.:
//
//       `postMessage(JSON.stringify({ type: 'SET_PROPS', data: { readOnly: true } }))`
//
export default function HyloTipTapEditorMobile () {
  const editorRef = useRef()
  const [contentHTML, setContentHTML] = useState()
  const [hideMenu, setHideMenu] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const [placeholder, setPlaceholder] = useState()
  const [groupIds, setGroupIds] = useState()

  // Sending Messages
  const handleBeforeCreate = () => {
    sendMessageToWebView(WebViewMessageTypes.EDITOR.LOADED)
  }

  const handleChange = useCallback(contentHTML => (
    sendMessageToWebView(WebViewMessageTypes.EDITOR.ON_CHANGE, contentHTML)
  ))

  const handleEnter = useCallback(() => {
    if (editorRef.current) {
      sendMessageToWebView(WebViewMessageTypes.EDITOR.ON_ENTER, editorRef.current.getHTML())

      // Tell Editor this keyboard event was handled and to end propagation.
      return true
    }
  })

  const handleAddTopic = useCallback(topic => (
    sendMessageToWebView(WebViewMessageTypes.EDITOR.ON_ADD_TOPIC, topic)
  ))

  const handleMessage = message => {
    try {
      const { type, data } = JSON.parse(message.data)

      switch (type) {
        case WebViewMessageTypes.EDITOR.CLEAR_CONTENT: {
          editorRef.current && editorRef.current.clearContent()
          break
        }

        case WebViewMessageTypes.EDITOR.SET_PROPS: {
          const propsToSet = pickBy(p => p !== undefined, data)

          if ('content' in propsToSet) setContentHTML(propsToSet.content)
          if ('readOnly' in propsToSet) setReadOnly(propsToSet.readOnly)
          if ('hideMenu' in propsToSet) setHideMenu(propsToSet.hideMenu)
          if ('placeholder' in propsToSet) setPlaceholder(propsToSet.placeholder)
          if ('groupIds' in propsToSet) setGroupIds(propsToSet.groupIds)
          break
        }
      }
    } catch (err) {
      console.log('!!! error in handleMessage', err)
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)

    return () => window.removeEventListener('message')
  }, [])

  return (
    <HyloTipTapEditor
      styleName='hylo-app-container'
      onChange={handleChange}
      onEnter={handleEnter}
      onBeforeCreate={handleBeforeCreate}
      // onAddMention={handleAddMention}
      onAddTopic={handleAddTopic}
      // Should the default be empty or a paragraph?
      contentHTML={contentHTML}
      placeholder={placeholder}
      readOnly={readOnly}
      hideMenu={hideMenu}
      groupIds={groupIds}
      ref={editorRef}
    />
  )
}
