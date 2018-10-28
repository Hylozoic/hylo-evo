import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl } from 'util/navigation'

import { activitySelector, fetchRecentActivity } from './RecentActivity.store'

export function mapStateToProps (state, props) {
  return {
    activityItems: activitySelector(state, props)
  }
}

export const mapDispatchToProps = {
  fetchRecentActivity,
  showDetails: (id, slug, memberId) => push(postUrl(id, slug, {memberId})),
  editPost: (id, slug, memberId) => push(postUrl(id, slug, {action: 'edit', memberId}))
}

export default connect(mapStateToProps, mapDispatchToProps)
