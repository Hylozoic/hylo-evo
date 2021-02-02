import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { allGroupsUrl } from 'util/navigation'

export function mapDispatchToProps (dispatch) {
  return {
    goToAllGroups: () => dispatch(push(allGroupsUrl()))
  }
}

export default connect(null, mapDispatchToProps)
