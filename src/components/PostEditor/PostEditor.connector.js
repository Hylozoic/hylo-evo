import { connect } from 'react-redux'
import { createPost } from 'store/actions/posts'

export function mapStateToProps (state, props) {
  return {}
}

export const mapDispatchToProps = {
  createPost
}

export default connect(mapStateToProps, mapDispatchToProps)
