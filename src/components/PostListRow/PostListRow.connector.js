import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { postUrl } from 'util/navigation'
import reactOnPost from 'store/actions/reactOnPost'

export function mapDispatchToProps (dispatch, props) {
  const { post, routeParams, querystringParams } = props

  return {
    showDetails: () => dispatch(push(postUrl(post.id, routeParams, querystringParams))),
    reactOnPost: data => dispatch(reactOnPost(post.id, data))
  }
}

export default connect(() => ({}), mapDispatchToProps)
