import { connect } from 'react-redux'
import { getOthers } from './Header.store'

export function mapStateToProps (state, props) {
  return {
    otherParticipants: getOthers(props)
  }
}

export default connect(mapStateToProps)
