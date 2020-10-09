import { connect } from 'react-redux'
import getRouteParam from 'store/selectors/getRouteParam'
import getPerson from 'store/selectors/getPerson'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const personId = getRouteParam('personId', state, props)

  return {
    memberId: personId,
    member: getPerson(state, { personId }),
    currentUser: getMe(state)
  }
}

export default connect(mapStateToProps)
