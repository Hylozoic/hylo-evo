import { connect } from 'react-redux'
import { fetchMembers, getMembers } from './Members.store'

export function mapStateToProps (state, props) {
  return {
    canInvite: true,
    total: 1276,
    sort: 'name',
    members: getMembers(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { slug } = props.match.params
  return {
    fetchMembers: function (order, afterId) {
      return dispatch(fetchMembers(slug, order, afterId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
