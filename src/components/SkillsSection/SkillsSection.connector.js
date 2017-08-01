import { connect } from 'react-redux'
import { addSkill, removeSkill, fetchMemberSkills, getMemberSkills,
  fetchSkills, getSkills, setAutocomplete, getAutocomplete, FETCH_MEMBER_SKILLS } from './SkillsSection.store'
import getMe from 'store/selectors/getMe'
import getPerson from 'store/selectors/getPerson'

export function mapStateToProps (state, props) {
  const member = getPerson(state, {personId: props.memberId})
  const currentUser = getMe(state, props)
  const isMe = currentUser && member && currentUser.id === member.id
  const autocomplete = getAutocomplete(state)

  return {
    skills: getMemberSkills(state, props),
    isMe,
    currentUser,
    suggestions: getSkills(state, { autocomplete, memberId: props.memberId }),
    pending: !!state.pending[FETCH_MEMBER_SKILLS],
    autocomplete: getAutocomplete(state)
  }
}

export const mapDispatchToProps = {
  addSkill,
  removeSkill,
  fetchMemberSkills,
  setAutocomplete,
  fetchSkills
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    autocomplete
  } = stateProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchSkills: () => dispatchProps.fetchSkills(autocomplete)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
