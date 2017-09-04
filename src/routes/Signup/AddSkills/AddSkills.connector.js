import { connect } from 'react-redux'
import { push, goBack } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { addSkill, fetchMySkills, getMySkills } from './AddSkills.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  return {
    currentUser,
    skills: getMySkills(state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    addSkill: () => dispatch(addSkill()),
    fetchMemberSkills: () => dispatch(fetchMySkills()),
    goToNextStep: () => dispatch(push('/signup/review')),
    goToPreviousStep: () => dispatch(push('/signup/add-location')),
    goBack: () => dispatch(goBack())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)
