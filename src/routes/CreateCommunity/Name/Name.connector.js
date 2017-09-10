import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { addCommunityName } from '../CreateCommunity.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  return {
    communityName: get('name', state.CreateCommunity)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/create-community/domain')),
    addCommunityName: (name) => dispatch(addCommunityName(name))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
