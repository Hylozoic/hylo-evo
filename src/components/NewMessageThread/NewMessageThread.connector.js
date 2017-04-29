import { connect } from 'react-redux'

import { participantsSelector } from './NewMessageThread.store'

export function mapStateToProps (state) {
  return {
    participants: participantsSelector(state)
  }
}

export default connect(mapStateToProps)
