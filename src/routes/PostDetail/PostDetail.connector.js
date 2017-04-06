import { connect } from 'react-redux'
// import { someAction } from 'some/path/to/actions'
import samplePost from 'components/PostCard/samplePost'

export function mapStateToProps (state, props) {
  return {
    post: samplePost()
  }
}

export const mapDispatchToProps = {
  // someAction
}

export default connect(mapStateToProps, mapDispatchToProps)
