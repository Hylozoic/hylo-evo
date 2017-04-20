import { connect } from 'react-redux'
import { push } from 'react-router-redux'

export function mapStateToProps (state, props) {
  return {}
}

export const mapDispatchToProps = {
  navigate: push
}

export default connect(mapStateToProps, mapDispatchToProps)
