import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { addSkill, fetchMemberSkills, getMemberSkills } from './AddSkills.store'

export function mapStateToProps (state, props) {
  console.log('mapStateToProps', state)
  const currentUser = getMe(state, props)
  return {
    currentUser,
    skills: getMemberSkills(state, {memberId: props.memberId})
  }
}

export const mapDispatchToProps = {
  addSkill,
  fetchMemberSkills
}
export default connect(mapStateToProps, mapDispatchToProps)
