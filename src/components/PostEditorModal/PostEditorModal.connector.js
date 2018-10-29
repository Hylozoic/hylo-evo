import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { get, omit } from 'lodash/fp'
import { postsUrl, postUrl } from 'util/navigation'

export const mapDispatchToProps = (dispatch, props) => {
  const matchParams = get('match.params', props)

  if (!matchParams) return {}

  const { postId, slug } = matchParams
  const urlParams = {
    communitySlug: slug,
    ...omit(['postId', 'action', 'slug'], matchParams)
  }
  const closeUrl = postId
    ? postUrl(postId, urlParams)
    : postsUrl(urlParams)

  return {
    hidePostEditor: () => dispatch(push(closeUrl))
  }
}

export default connect(null, mapDispatchToProps)
