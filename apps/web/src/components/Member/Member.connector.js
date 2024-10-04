import { connect } from 'react-redux'
import { push } from "redux-first-history";
import { personUrl } from 'util/navigation'
import getMe from 'store/selectors/getMe'
import getResponsibilitiesForGroup from 'store/selectors/getResponsibilitiesForGroup'
import getRolesForGroup from 'store/selectors/getRolesForGroup'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const currentUserResponsibilities = getResponsibilitiesForGroup(state, { person: currentUser, groupId: props.group.id }).map(r => r.title)
  const roles = getRolesForGroup(state, { person: props.member, groupId: props.group.id })

  return {
    currentUserResponsibilities,
    roles
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    goToPerson: (id, slug) => () => dispatch(push(personUrl(id, slug)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
