import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'
import getParam from 'store/selectors/getParam'
import getQueryParam from 'store/selectors/getQueryParam'
import { FETCH_POSTS } from 'store/constants'
import { mapDispatchToProps } from 'routes/CommunityFeed'

export function mapStateToProps (state, props) {
  const filter = getQueryParam('t', state, props)
  const sortBy = getQueryParam('s', state, props)

  return {
    filter,
    sortBy,
    selectedPostId: getParam('postId', state, props),
    pending: state.pending[FETCH_POSTS],
    currentUser: getMe(state, props)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
