import { connect } from 'react-redux'
import { fetchPost } from 'store/actions/posts'
import { getPostById } from 'store/selectors/getPostById'

export function mapStateToProps (state, props) {
  return {
    post: getPostById(state, props)
  }
}

export const mapDispatchToProps = { fetchPost }

export default connect(mapStateToProps, mapDispatchToProps)
