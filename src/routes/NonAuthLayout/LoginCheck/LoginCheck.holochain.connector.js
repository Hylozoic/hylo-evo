import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { isNull } from 'lodash'
import { setLogin } from '../Login/Login.store'
import HolochainCurrentUserQuery from 'graphql/queries/HolochainCurrentUserQuery.graphql'

export function mapStateToProps (state, props) {
  return {
    hasCheckedLogin: !isNull(state.login.isLoggedIn)
  }
}

const mapDispatchToProps = {
  setLogin
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { holochainAgent } = ownProps
  const { setLogin } = dispatchProps

  const checkLogin = holochainAgent
    ? () => setLogin(holochainAgent.isRegistered)
    : () => {}

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    checkLogin
  }
}

const holochainAgent = graphql(HolochainCurrentUserQuery, {
  skip: props => props.holochainAgent,
  props: ({ data: { me: holochainAgent } }) => ({
    holochainAgent
  })
})

export default compose(
  holochainAgent,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)
