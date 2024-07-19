import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import isPendingFor from 'store/selectors/isPendingFor'
import getMe from 'store/selectors/getMe'
import getPerson from 'store/selectors/getPerson'
import {
  addSkill,
  addSkillToGroup,
  removeSkill,
  removeSkillFromGroup,
  fetchMemberSkills,
  fetchSkillSuggestions,
  getMemberSkills,
  getSkillSuggestions,
  getSearch,
  setSearch
} from './SkillsSection.store'

import { setSearchTerm } from '../../routes/Search/Search.store'

export function mapStateToProps (state, props) {
  const person = getPerson(state, props)
  const currentUser = getMe(state, props)
  const search = getSearch(state)
  const group = props.group

  return {
    currentUser,
    loading: !group && isPendingFor(fetchMemberSkills, state),
    search,
    skillSuggestions: getSkillSuggestions(state, { search, ...props }),
    skills: group ? group.suggestedSkills : getMemberSkills(state, props),
    isMe: !group && currentUser && person && currentUser.id === person.id,
    group
  }
}

export function mapDispatchToProps (dispatch, props) {
  const group = props.group

  return {
    addSkill: group ? name => dispatch(addSkillToGroup(group.id, name)) : name => dispatch(addSkill(name)),
    removeSkill: group ? skillId => dispatch(removeSkillFromGroup(group.id, skillId)) : skillId => dispatch(removeSkill(skillId)),
    fetchSkillSuggestions: search => dispatch(fetchSkillSuggestions(search)),
    fetchMemberSkills: (id, limit) => dispatch(fetchMemberSkills(id, limit)),
    setSearch: search => dispatch(setSearch(search)),
    searchForSkill: (skill) => {
      dispatch(setSearchTerm(skill))
      dispatch(push('/search?t=' + skill))
    }
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchMemberSkills: stateProps.group ? () => {} : () => dispatchProps.fetchMemberSkills(ownProps.personId),
    fetchSkillSuggestions: () => dispatchProps.fetchSkillSuggestions(stateProps.search)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
