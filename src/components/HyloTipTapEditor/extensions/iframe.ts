import { Node } from '@tiptap/core'

export interface IframeOptions {
  allowFullscreen: boolean,
  HTMLAttributes: {
    [key: string]: any
  },
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: { src: string }) => ReturnType
    }
  }
}

export default Node.create<IframeOptions>({
  name: 'iframe',

  group: 'block',

  atom: true,

  addOptions () {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'iframe-wrapper'
      },
    }
  },

  addAttributes () {
    return {
      src: {
        default: null,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen
      },
    }
  },

  parseHTML () {
    return [{ tag: 'iframe' }]
  },

  renderHTML ({ HTMLAttributes }) {
    return ['div', this.options.HTMLAttributes, ['iframe', HTMLAttributes]]
  },

  addCommands () {
    return {
      setIframe: (options: { src: string }) => ({ tr, dispatch }) => {
        const { selection } = tr
        const node = this.type.create(options)

        if (dispatch) {
          tr.replaceRangeWith(selection.from, selection.to, node)
        }

        return true
      }
    }
  }

  // From link extension, suppressing clickable
  // addProseMirrorPlugins() {
  //   const plugins = []

  //   if (this.options.clickable) {
  //     plugins.push(clickHandler({
  //       type: this.type,
  //     }))
  //   }

  //   return plugins
  // }
})
