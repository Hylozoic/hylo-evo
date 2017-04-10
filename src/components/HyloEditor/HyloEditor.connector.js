import { connect } from 'react-redux'
import {
  findMentions,
  clearMentions,
  getMentionResults,
  findHashtags,
  clearHashtags,
  getHashtagResults
} from './store'

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

export default connect(mapStateToProps, mapDispatchToProps)
