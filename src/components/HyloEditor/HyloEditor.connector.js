import { connect } from 'react-redux'
import autoproxy from 'autoproxy'
import {
  findMentions,
  clearMentions,
  getMentionResults,
  findHashtags,
  clearHashtags,
  getHashtagResults
} from './HyloEditor.store'

export function mapStateToProps (state, props) {
  return {
    mentionResults: getMentionResults(state, props),
    hashtagResults: getHashtagResults(state, props)
  }
}

export const mapDispatchToProps = {
  findMentions,
  clearMentions,
  findHashtags,
  clearHashtags
}

export default autoproxy(connect(mapStateToProps, mapDispatchToProps))
