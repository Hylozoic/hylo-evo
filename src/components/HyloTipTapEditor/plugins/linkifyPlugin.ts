import { Plugin } from 'prosemirror-state'
import { Fragment, Node, Slice } from 'prosemirror-model'

export const linkifyPlugin = new Plugin({
  props: {
    transformPasted: (slice: Slice) => {
      return new Slice(linkify(slice.content), slice.openStart, slice.openEnd)
    }
  }
})

const HTTP_LINK_REGEX = /\bhttps?:\/\/[\w_\/\.]+/g

const linkify = function(fragment: Fragment): Fragment {
  var linkified : Node[] = []
  console.log('!!! fragment', fragment)
  fragment.forEach(function(child: Node){
    if (child.isText) {
      const text = child.text as string
      var pos = 0, match

      while (match = HTTP_LINK_REGEX.exec(text)) {
        var start = match.index
        var end = start + match[0].length
        var link = child.type.schema.marks['link']

        // simply copy across the text from before the match
        if (start > 0) {
          linkified.push(child.cut(pos, start))
        }

        const urlText = text.slice(start, end)
        linkified.push(
          child.cut(start, end).mark(link.create({href: urlText}).addToSet(child.marks))
        )
        pos = end
      }

      // copy over whatever is left
      if (pos < text.length) {
        linkified.push(child.cut(pos))
      }
    } else {
      linkified.push(child.copy(linkify(child.content)))
    }
  })

  return Fragment.fromArray(linkified)
}

// import {InputRule, addInputRule} from '../src/inputrules';
// addInputRule(pm, new InputRule(/hello$/, '', () => console.log('hello')));

// import {InputRule} from 'prosemirror/dist/inputrules';
// import {LinkMark} from 'prosemirror/dist/model';
// LinkMark.register('autoInput', new InputRule(
//   'makeLink',
//   /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?) $/,
//   ' ',
//   function(pm, match, pos) {
//     const url = match[1];
//     const startPos = pos.move(-match[0].length);
//     pm.tr.addMark(startPos, startPos.move(url.length), this.create({href: url, title: url})).apply();
//   }
// ))
