import { connect } from 'react-redux'
import { getPerson } from './MessageMember.store'

export function mapStateToProps (state, props) {
  const member = getPerson(state, props)
  return {
    member
  }
}

export default connect(mapStateToProps)
