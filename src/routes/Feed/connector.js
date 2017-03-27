import { connect } from 'react-redux'
import { SAMPLE_FEED_ITEMS } from './sampleData'

function mapStateToProps (state) {
  return {
    feedItems: SAMPLE_FEED_ITEMS
  }
}

function mapDispatchToProps (dispatch, props) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)
