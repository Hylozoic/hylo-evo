import { connect } from 'react-redux'
import { communityJoinUrl } from 'util/index'
// import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { community } = props
  const inviteLink = communityJoinUrl(community)

  return {
    inviteLink
  }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)
