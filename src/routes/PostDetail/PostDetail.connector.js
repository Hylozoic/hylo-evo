import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl } from 'util/index'
import fetchPost from 'store/actions/fetchPost'
import getParam from 'store/selectors/getParam'
import getPost from 'store/selectors/getPost'

export function mapStateToProps (state, props) {
  const slug = getParam('slug', state, props)
  return {
    post: getPost(state, props),
    id: getParam('postId', state, props),
    slug,
    showCommunity: !slug
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const { location } = props

  const removePostDetailFromPath = pathname =>
    pathname.replace(/\/p\/(.+)/, '')

  const closeLocation = {
    ...props.location,
    pathname: removePostDetailFromPath(location.pathname)
  }

  const postId = getParam('postId', {}, props)

  return {
    fetchPost: () => dispatch(fetchPost(getParam('postId', {}, props))),
    onClose: () => dispatch(push(closeLocation)),
    editPost: () => dispatch(push(postUrl(postId) + '/edit'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
