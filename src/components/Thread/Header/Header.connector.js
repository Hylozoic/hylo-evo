import { connect } from 'react-redux'
import { getParticipants, getOthers } from './Header.store'

export function mapStateToProps (state, props) {
  const participants = getParticipants(props)
  const others = getOthers(props, participants)
  return {
    participants,
    others
  }
}

export default connect(mapStateToProps)
