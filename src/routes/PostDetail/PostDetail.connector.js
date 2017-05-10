import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { fetchPost } from 'store/actions/fetchPost'
import getParam from 'store/selectors/getParam'
import getPost from 'store/selectors/getPost'

export function mapStateToProps (state, props) {
  const slug = getParam('slug', state, props)
  return {
    post: getPost(state, props),
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

  return {
    fetchPost: () => dispatch(fetchPost(getParam('postId', {}, props))),
    onClose: () => dispatch(push(closeLocation))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
