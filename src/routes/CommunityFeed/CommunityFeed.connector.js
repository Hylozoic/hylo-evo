import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getParam from 'store/selectors/getParam'
import { getMe } from 'store/selectors/getMe'
import changeQueryParam from 'store/actions/changeQueryParam'
import getQueryParam from 'store/selectors/getQueryParam'
import { push } from 'react-router-redux'
import { postUrl } from 'util/index'
import { makeUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const filter = getQueryParam('t', state, props)
  const sortBy = getQueryParam('s', state, props)

  return {
    filter,
    sortBy,
    selectedPostId: getParam('postId', state, props),
    community,
    postCount: get('postCount', community),
    pending: state.pending[FETCH_POSTS],
    currentUser: getMe(state, props)
  }
}

export const mapDispatchToProps = function (dispatch, props) {
  const slug = getParam('slug', null, props)
  const params = getQueryParam(['s', 't'], null, props)
  return {
    changeTab: tab => dispatch(changeQueryParam(props, 't', tab, 'all')),
    changeSort: sort => dispatch(changeQueryParam(props, 's', sort, 'all')),

    // we need to preserve url parameters when opening the details for a post,
    // or the center column will revert to its default sort & filter settings
    showPostDetails: id => dispatch(push(makeUrl(postUrl(id, slug), params)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
