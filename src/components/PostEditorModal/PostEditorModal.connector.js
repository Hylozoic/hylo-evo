import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { get, omit } from 'lodash/fp'
import { baseUrl, postUrl } from 'util/navigation'

export const mapDispatchToProps = (dispatch, props) => {
  const routeParams = get('match.params', props)

  if (!routeParams) return {}

  const { postId } = routeParams
  const urlParams = omit(['postId', 'action'], routeParams)
  const closeUrl = postId
    ? postUrl(postId, urlParams)
    : baseUrl(urlParams)

  return {
    hidePostEditor: () => dispatch(push(closeUrl))
  }
}

export default connect(null, mapDispatchToProps)
