import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { debounce } from 'lodash/fp'
import fetchPeople from 'store/actions/fetchPeople'
import { invitePeopleToEvent, peopleSelector } from './EventInviteDialog.store'
import { FETCH_PEOPLE } from 'store/constants'

export function mapStateToProps (state, props) {
  const people = peopleSelector(state, props)

  return {
    people,
    pending: state.pending[FETCH_PEOPLE]
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    ...bindActionCreators({
      invitePeopleToEvent
    }, dispatch),
    fetchPeople: debounce(300, (args) => dispatch(fetchPeople(args)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
