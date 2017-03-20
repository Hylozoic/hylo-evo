import { connect } from 'react-redux'
import { fetchPost } from 'store/actions/posts'

export function mapStateToProps (state, { id }) {
  return { post: state.posts[id] }
}

export const mapDispatchToProps = { fetchPost }

export default connect(mapStateToProps, mapDispatchToProps)
