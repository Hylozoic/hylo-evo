import { connect } from 'react-redux'
import { push, goBack } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { addSkill, fetchMySkills, getMySkills, removeSkill } from './AddSkills.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  return {
    currentUser,
    skills: getMySkills(state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    addSkill: (name) => dispatch(addSkill(name)),
    fetchMySkills: () => dispatch(fetchMySkills()),
    goToNextStep: () => dispatch(push('/signup/review')),
    goToPreviousStep: () => dispatch(push('/signup/add-location')),
    goBack: () => dispatch(goBack()),
    removeSkill: (id) => dispatch(removeSkill(id))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)
