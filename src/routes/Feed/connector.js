import { connect } from 'react-redux'
import { fetchFeedItems } from './actions'

function mapStateToProps (state) {
  return {
    feedItems: state.posts
  }
}

// export const mapDispatchToProps = { fetchFeedItems }

function mapDispatchToProps (dispatch) {
  return {
    fetchFeedItems: slug => {
      console.log('calling action', slug)
      return dispatch(fetchFeedItems(slug))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
