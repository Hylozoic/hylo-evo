import { connect } from 'react-redux'
import { SAMPLE_FEED_ITEMS } from './sampleData'
import { fetchFeedItems } from './actions'

function mapStateToProps (state) {
  return {
    feedItems: state.posts
  }
}

export const mapDispatchToProps = { fetchFeedItems }

export default connect(mapStateToProps, mapDispatchToProps)
