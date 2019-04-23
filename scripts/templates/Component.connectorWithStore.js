import { connect } from 'react-redux'
import {
  fetchExample,
  getExample
} from './Component.store'
// import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    example: getExample(state, props)
    //  currentUser: getMe(state, props)
  }
}

export const mapDispatchToProps = {
  fetchExample
}

export default connect(mapStateToProps, mapDispatchToProps)
