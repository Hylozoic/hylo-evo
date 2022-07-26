import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import MentionList from './MentionList'

export default {
  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          offset: -10,
          placement: 'bottom-start'
        })
      },

      onUpdate (props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect
        })
      },

      onKeyDown (props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component?.ref?.onKeyDown(props)
      },

      onExit () {
        console.log('!!! onExit called -- early?')
        popup[0].destroy()
        component.destroy()
      }
    }
  }
}
