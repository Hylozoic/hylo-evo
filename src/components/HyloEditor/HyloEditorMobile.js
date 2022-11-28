import React, { useState, useCallback, useEffect, useRef } from 'react'
import { pickBy } from 'lodash/fp'
import { WebViewMessageTypes } from 'hylo-shared'
import { sendMessageToWebView } from 'util/webView'
import HyloEditor from 'components/HyloEditor'
import './HyloEditorMobile.scss'

/*

  This Mobile editor can be tested in a browser at `hyloApp/editor`.

  To control the editor manually post messages via the Web Console, e.g.:

  `postMessage(JSON.stringify({ type: 'SET_PROPS', data: { readOnly: true } }))`

*/
export default function HyloEditorMobile (props) {
  const editorRef = useRef()
  // Should the default be empty or a paragraph?
  const [contentHTML, setContentHTML] = useState()
  const [groupIds, setGroupIds] = useState()
  const [placeholder, setPlaceholder] = useState()
  const [showMenu, setShowMenu] = useState(false)
  const [readOnly, setReadOnly] = useState(false)

  // Sending Messages

  // https://github.com/Hylozoic/HyloReactNative/issues/568
  // const handleAddLink = useCallback(url => {
  //   sendMessageToWebView(WebViewMessageTypes.EDITOR.ON_ADD_LINK, url)
  // })

  const handleAddTopic = useCallback(topic => (
    sendMessageToWebView(WebViewMessageTypes.EDITOR.ON_ADD_TOPIC, topic)
  ))

  const handleBeforeCreate = () => {
    sendMessageToWebView(WebViewMessageTypes.EDITOR.LOADED)
  }

  const handleUpdate = useCallback(contentHTML => (
    sendMessageToWebView(WebViewMessageTypes.EDITOR.ON_UPDATE, contentHTML)
  ))

  const handleEnter = useCallback(() => {
    if (editorRef.current) {
      sendMessageToWebView(WebViewMessageTypes.EDITOR.ON_ENTER, editorRef.current.getHTML())

      return false
    }
  })

  const handleMessage = message => {
    try {
      const { type, data } = JSON.parse(message.data)

      switch (type) {
        case WebViewMessageTypes.EDITOR.CLEAR_CONTENT: {
          setContentHTML()
          editorRef.current && editorRef.current.clearContent()
          break
        }

        case WebViewMessageTypes.EDITOR.FOCUS: {
          editorRef.current && editorRef.current.focus(data)
          break
        }

        case WebViewMessageTypes.EDITOR.BLUR: {
          editorRef.current && editorRef.current.blur()
          break
        }

        case WebViewMessageTypes.EDITOR.SET_PROPS: {
          const propsToSet = pickBy(p => p !== undefined, data)

          if ('content' in propsToSet) setContentHTML(propsToSet.content)
          if ('readOnly' in propsToSet) setReadOnly(propsToSet.readOnly)
          if ('showMenu' in propsToSet) setShowMenu(propsToSet.showMenu)
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
    // Note: Final `true` parameter is essential for this call
    // to work in both iOS and Android.
    window.addEventListener('message', handleMessage, true)

    return () => window.removeEventListener('message')
  }, [])

  return React.createElement(HyloEditor, {
    containerClassName: 'hyloEditorMobileContainer',
    contentHTML,
    className: 'hyloEditorMobile',
    onUpdate: handleUpdate,
    onEnter: handleEnter,
    onBeforeCreate: handleBeforeCreate,
    // Not implemented: No ADD_MENTION constant
    // onAddMention: handleAddMention
    // onAddLink: handleAddLink,
    onAddTopic: handleAddTopic,
    groupIds,
    maxSuggestions: 7,
    placeholder,
    readOnly,
    showMenu,
    suggestionsThemeName: 'suggestions-mobile',
    ref: editorRef
  })
}
