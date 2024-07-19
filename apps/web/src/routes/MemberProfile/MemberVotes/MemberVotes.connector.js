import { connect } from 'react-redux'
import {
  getMemberVotes,
  fetchMemberVotes
} from './MemberVotes.store'

export function mapStateToProps (state, props) {
  return {
    posts: getMemberVotes(state, props) // TODO REACTIONS: switch this to reactions
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchMemberVotes: () => dispatch(fetchMemberVotes(props.routeParams.personId)) // TODO REACTIONS: switch this to reactions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
