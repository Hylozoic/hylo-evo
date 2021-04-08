import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { get } from 'lodash/fp'
import { addSkill, removeSkill } from 'components/SkillsSection/SkillsSection.store'
import { updateMembershipSettings } from 'routes/UserSettings/UserSettings.store'
import presentGroup from 'store/presenters/presentGroup'
import getMe from 'store/selectors/getMe'
import getRouteParam from 'store/selectors/getRouteParam'
import { groupUrl } from 'util/navigation'
import { fetchGroupWelcomeData } from './GroupWelcomeModal.store'

export function mapStateToProps (state, props) {
  const group = presentGroup(props.group)

  return {
    currentUser: getMe(state),
    group
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const groupSlug = getRouteParam('groupSlug', null, props, false)

  return {
    addSkill: (name) => dispatch(addSkill(name)),
    closeModal: () => dispatch(push(groupUrl(groupSlug))),
    fetchGroupWelcomeData: () => dispatch(fetchGroupWelcomeData(props.group.id)),
    removeSkill: (skillId) => dispatch(removeSkill(skillId)),
    submit: (groupId) => dispatch(updateMembershipSettings(groupId, { showJoinForm: false }))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { group } = stateProps
  const { closeModal, submit } = dispatchProps

  const exitModal = get('id', group) ? () => { submit(group.id); closeModal() } : () => {}
  return {
    ...stateProps,
    ...dispatchProps,
    closeModal: exitModal,
    submit: exitModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
