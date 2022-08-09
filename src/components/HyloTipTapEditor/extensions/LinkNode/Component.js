import { NodeViewWrapper } from '@tiptap/react'
import React from 'react'

export default props => {
  const addLinkPreview = () => {
    console.log('!!!!!! props:', props)
    console.log('!!!!!! looking for href for LinkPreview:', props.node.attrs)
  }

  return (
    <NodeViewWrapper className='react-component'>
      <span className='label'>React Component</span>

      <div className='content'>
        <button onClick={addLinkPreview}>
          Add Link Preview for {props.node.attrs.href}
        </button>
      </div>
    </NodeViewWrapper>
  )
}
