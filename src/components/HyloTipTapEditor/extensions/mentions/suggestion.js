import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import MentionList from './MentionList'

export default {
  render: () => {
    let component
    let popup

    const createPopup = clientRect => {
      return tippy('body', {
        getReferenceClientRect: clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        offset: -10,
        placement: 'bottom-start'
      })
    }

    return {
      onStart: props => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor
        })

        if (!props.clientRect) {
          return
        }

        popup = createPopup(props.clientRect)
      },

      onUpdate (props) {
        if (!props.clientRect || !component) return

        component.updateProps(props)

        if (popup[0].state.isDestroyed) {
          popup = createPopup(props.clientRect)
        } else {
          popup[0].setProps({
            getReferenceClientRect: props.clientRect
          })
        }
      },

      onKeyDown (props) {
        if (props.event.key === 'Escape') {
          // Seems to be better to destroy and re-create in this case
          // popup[0].hide()
          this.onExit()

          return true
        }

        return component?.ref?.onKeyDown(props)
      },

      onExit () {
        // console.log('!!! Mention Plugin `suggestion.onExit()` called early?')
        popup && popup[0].destroy()
        component && component.destroy()
      }
    }
  }
}
