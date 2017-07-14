import { connect } from 'react-redux'
import {
  fetchExample,
  getExample
} from './NetworkCommunities.store'
// import getMe from 'store/selectors/getMe'

const network = {
  name: 'Lawyers For Good Government'
}

export function mapStateToProps (state, props) {
  return {
    network
//  currentUser: getMe(state, props)
  }
}

export const mapDispatchToProps = {
  fetchExample
}

export default connect(mapStateToProps, mapDispatchToProps)
