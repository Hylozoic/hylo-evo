import { connect } from 'react-redux'
import {
  getMemberComments,
  fetchMemberComments
} from './MemberComments.store'

export function mapStateToProps (state, props) {
  return {
    comments: getMemberComments(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchMemberComments: () => dispatch(fetchMemberComments(props.routeParams.personId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
