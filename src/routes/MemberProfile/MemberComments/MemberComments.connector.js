import { connect } from 'react-redux'

import { memberCommentsSelector, fetchMemberComments } from './MemberComments.store'

export function mapStateToProps (state, props) {
  return {
    comments: memberCommentsSelector(state, props)
  }
}

export default connect(mapStateToProps, { fetchMemberComments })
