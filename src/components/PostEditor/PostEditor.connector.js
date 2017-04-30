import { connect } from 'react-redux'
import { createPost } from './PostEditor.store'
import { getMe } from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const communityOptions = currentUser &&
    currentUser.memberships.toModelArray().map(m => m.community)
  return {
    communityOptions
  }
}

export const mapDispatchToProps = {
  createPost
}

export default connect(mapStateToProps, mapDispatchToProps)
