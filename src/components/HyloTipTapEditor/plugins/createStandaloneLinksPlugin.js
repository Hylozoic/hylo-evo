import { Plugin } from 'prosemirror-state'

const handle = (view, slice) => {
  // allow other handlers a chance to deal with this input if we don't take it
  let handle = false

  // in our case we only want to deal with urls pasted in by themselves
  // so we bail if the thing pasted is more than just a single bit of text
  if (slice.content.childCount > 1) return handle

  // walk the inner content of the pasted node (which as I recall is usually a paragraph)
  // there is probably a better way to do this
  slice.content.descendants((node, pos, parent) => {
    // check that we're dealing with text and that it matches our expected url pattern
    if (node.type.name === 'text' && /^https:\/\/www\.youtube\.com\/.*?$/.test(node.text)) {
      handle = true // let subsequent handlers know we took this one

      // create our custom node
      const newNode = view.state.config.schema.nodes.apm_inline_frame.create({ src: node.text })

      // in our case we can just insert the newly created node into the existing document
      view.dispatch(view.state.tr.replaceSelectionWith(newNode))

      // I've removed some code that displays a custom react dialog (don't get me started)
      // which messes with view focus so you may not need this one.
      view.focus()
    }
  })

  return handle
}

// used when configuring our Editor instance
export function createStandaloneLinksPlugin () {
  return new Plugin({
    props: {
      handlePaste (view, event, slice) {
        return handle(view, slice)
      }
    }
  })
}

// // From link-extension (Mark, not Node)
// import { getAttributes } from '@tiptap/core'
// import { MarkType } from 'prosemirror-model'
// import { Plugin, PluginKey } from 'prosemirror-state'

// type ClickHandlerOptions = {
//   type: MarkType,
// }

// export function clickHandler(options: ClickHandlerOptions): Plugin {
//   return new Plugin({
//     key: new PluginKey('handleClickLink'),
//     props: {
//       handleClick: (view, pos, event) => {
//         const attrs = getAttributes(view.state, options.type.name)
//         const link = (event.target as HTMLElement)?.closest('a')

//         if (link && attrs.href) {
//           window.open(attrs.href, attrs.target)

//           return true
//         }

//         return false
//       },
//     },
//   })
// }
