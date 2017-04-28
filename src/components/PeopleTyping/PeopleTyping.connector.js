import { connect } from 'react-redux'
import getPeopleTyping from 'store/selectors/getPeopleTyping'

export function mapStateToProps (state, props) {
  return {
    peopleTyping: getPeopleTyping(state)
  }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)
