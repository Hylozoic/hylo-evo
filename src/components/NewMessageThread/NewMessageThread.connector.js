import { connect } from 'react-redux'

export function mapStateToProps ({ NewMessageThread }) {
  return {
    participants: NewMessageThread.participants
  }
}

export default connect(mapStateToProps)
