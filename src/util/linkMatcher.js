import linkifyIt from 'linkify-it'
import tlds from 'tlds'

const linkMatcher = linkifyIt()
linkMatcher.tlds(tlds)

export default linkMatcher
