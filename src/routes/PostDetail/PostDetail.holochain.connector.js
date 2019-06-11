import HolochainPostQuery from 'graphql/queries/HolochainPostQuery.graphql'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { HOLOCHAIN_POLL_INTERVAL_SLOW } from 'util/holochain'
import { editPostUrl, removePostFromUrl } from 'util/navigation'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const id = getRouteParam('postId', state, props)
  const routeParams = props.match.params
  const currentUser = getMe(state)

  return {
    id,
    routeParams,
    currentUser,
    isProjectMember: null,
    fetchPost: () => {},
    voteOnPost: () => {},
    processStripeToken: () => {},
    respondToEvent: () => {},
    joinProject: () => {},
    leaveProject: () => {}
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { location } = props
  const postId = getRouteParam('postId', {}, props)
  const closeLocation = {
    ...props.location,
    pathname: removePostFromUrl(location.pathname)
  }

  return {
    editPost: () => dispatch(push(editPostUrl(postId, props.match.params))),
    onClose: () => dispatch(push(closeLocation))
  }
}

export const posts = graphql(HolochainPostQuery, {
  props: ({ data: { post, loading } }) => {
    return {
      post: post,
      pending: loading
    }
  },
  options: ({ id }) => ({
    variables: {
      id
    },
    pollInterval: HOLOCHAIN_POLL_INTERVAL_SLOW
  })
})

export default compose(
  connect(mapStateToProps),
  posts
)
