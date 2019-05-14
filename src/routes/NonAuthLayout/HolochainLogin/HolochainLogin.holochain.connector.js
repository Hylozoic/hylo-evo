import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { setLogin } from '../Login/Login.store'
import HolochainRegisterUserMutation from 'graphql/mutations/HolochainRegisterUserMutation.graphql'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'

export function mapStateToProps (state, props) {
  return {
    returnToURL: getReturnToURL(state)
  }
}

export const mapDispatchToProps = {
  resetReturnToURL,
  push,
  setLogin
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    redirectOnSignIn: (defaultPath) => {
      dispatchProps.resetReturnToURL()
      dispatchProps.push(stateProps.returnToURL || defaultPath)
    }
  }
}

const registerHolochainAgent = graphql(HolochainRegisterUserMutation, {
  props: ({ mutate }) => {
    return {
      registerHolochainAgent: (name, avatarUrl) => mutate({
        variables: {
          name,
          avatarUrl
        }
      })
    }
  }
})

export default compose(
  registerHolochainAgent,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)
