import { connect } from 'react-redux'
import { SAMPLE_FEED_ITEMS } from './sampleData'
import { fetchPosts } from './actions'

function mapStateToProps (state) {
  return {
    feedItems: state.posts
  }
}

export const mapDispatchToProps = { fetchPosts }

export default connect(mapStateToProps, mapDispatchToProps)
