import React, { useCallback, useEffect, useRef } from 'react'
import { HyloApp } from 'hylo-shared'
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

    return HyloApp.sendMessageToWebView(HyloApp.EDITOR.onChange, contentHTML)
  })

  const handleEnter = useCallback(() =>
    HyloApp.sendMessageToWebView(HyloApp.EDITOR.onEnter, editorRef.current.getHTML())
  )

  const handleAddTopic = useCallback(topic => (
    HyloApp.sendMessageToWebView(HyloApp.EDITOR.onAddTopic, topic)
  ))

  const handleMessage = message => {
    const { type, data } = JSON.parse(message)

    switch (type) {
      case HyloApp.EDITOR.setContent: {
        editorRef.current.setContent(data)
      }
    }
  }

  // Receiving Messages
  // TOOD: Not working yet
  useEffect(() => {
    const element = editorRef.current

    if (element && element.addEventListener) {
      console.log('!!!! element in event listerer:', element)
      element.addEventListener('message', handleMessage)

      return () => element.removeEventListener('message')
    }
  }, [editorRef.current])

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
