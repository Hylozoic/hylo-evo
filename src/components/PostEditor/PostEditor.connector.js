import { connect } from 'react-redux'
import { createPost } from 'store/actions/posts'
import { getMe } from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const communities = currentUser &&
    currentUser.memberships.toModelArray().map(m => m.community)
  return {
    currentUser,
    communities
  }
}

export const mapDispatchToProps = {
  createPost
}

export default connect(mapStateToProps, mapDispatchToProps)
