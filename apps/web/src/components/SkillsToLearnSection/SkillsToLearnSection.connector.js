import { push } from "redux-first-history";
import { connect } from 'react-redux'
import isPendingFor from 'store/selectors/isPendingFor'
import getMe from 'store/selectors/getMe'
import getPerson from 'store/selectors/getPerson'
import {
  addSkill,
  removeSkill,
  fetchMemberSkills,
  getMemberSkills,
  fetchSkillSuggestions,
  getSkillSuggestions,
  getSearch,
  setSearch
} from './SkillsToLearnSection.store'

import { setSearchTerm } from '../../routes/Search/Search.store'

export function mapStateToProps (state, props) {
  const person = getPerson(state, props)
  const currentUser = getMe(state, props)
  const search = getSearch(state)

  return {
    loading: isPendingFor(fetchMemberSkills, state),
    search,
    skillSuggestions: getSkillSuggestions(state, { search, ...props }),
    skills: getMemberSkills(state, props),
    currentUser,
    isMe: currentUser && person && currentUser.id === person.id
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    addSkill: name => dispatch(addSkill(name)),
    removeSkill: skillId => dispatch(removeSkill(skillId)),
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
    fetchMemberSkills: () => dispatchProps.fetchMemberSkills(ownProps.personId),
    fetchSkillSuggestions: () => dispatchProps.fetchSkillSuggestions(stateProps.search)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
