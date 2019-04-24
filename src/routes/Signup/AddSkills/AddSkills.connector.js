import { connect } from 'react-redux'
import { push, goBack } from 'connected-react-router'
import getMe from 'store/selectors/getMe'
import { addSkill, removeSkill } from './AddSkills.store'
import fetchMySkills from 'store/actions/fetchMySkills'
import getMySkills from 'store/selectors/getMySkills'

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
