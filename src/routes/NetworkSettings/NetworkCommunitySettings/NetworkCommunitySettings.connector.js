import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'

import {
} from '../NetworkSettings.store'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const slug = props.network.slug
  const me = getMe(state)

  const communitySlug = getParam('communitySlug', state, props)

  console.log('props', props)

  return {
    isAdmin: me ? me.isAdmin : false,
    slug,
    communitySlug
  }
}

export function mapDispatchToProps (dispatch, state) {
  return {
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
