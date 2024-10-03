import { connect } from 'react-redux'
import { clearUserTyping, getPeopleTyping } from './PeopleTyping.store'

export function mapStateToProps (state, props) {
  return {
    peopleTyping: getPeopleTyping(state)
  }
}

export const mapDispatchToProps = { clearUserTyping }

export default connect(mapStateToProps, mapDispatchToProps)
