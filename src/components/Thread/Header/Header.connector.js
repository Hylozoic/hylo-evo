import { connect } from 'react-redux'
import { getOthers } from './Header.store'

export function mapStateToProps (state, props) {
  return {
    others: getOthers(props)
  }
}

export default connect(mapStateToProps)
