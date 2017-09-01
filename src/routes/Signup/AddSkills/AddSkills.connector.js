import { connect } from 'react-redux'
import { push, goBack } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { addSkill, fetchMemberSkills, getMemberSkills } from './AddSkills.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  return {
    currentUser,
    skills: getMemberSkills(state, {memberId: props.memberId})
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    addSkill: () => dispatch(addSkill()),
    fetchMemberSkills: () => dispatch(fetchMemberSkills()),
    goToNextStep: () => dispatch(push('/signup/add-location')),
    goToPreviousStep: () => dispatch(push('/signup/add-location')),
    goBack: () => dispatch(goBack())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)
