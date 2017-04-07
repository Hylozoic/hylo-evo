import { connect } from 'react-redux'
import { resetNavigation } from './store'

export function mapStateToProps (state, props) {
  return {
    to: state.navigation
  }
}

export const mapDispatchToProps = {
  resetNavigation
}

export default connect(mapStateToProps, mapDispatchToProps)
