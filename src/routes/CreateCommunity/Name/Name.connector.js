import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getCommunityName } from '../CreateCommunity.store'
import { addName } from './Name.store'

export function mapStateToProps (state, props) {
  return {
    communityName: getCommunityName(state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/create-community/domain')),
    addName: (name) => dispatch(addName(name))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
