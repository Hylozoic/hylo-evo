import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { setLogin } from '../Login/Login.store'
import HolochainRegisterUserMutation from 'graphql/mutations/HolochainRegisterUserMutation.graphql'
import HolochainCreateDefaultCommunityMutation from 'graphql/mutations/HolochainCreateDefaultCommunityMutation.graphql'
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
  const { returnToURL } = stateProps
  const { resetReturnToURL } = dispatchProps

  const redirectOnSignIn = defaultUrl => {
    resetReturnToURL()
    const redirectUrl = returnToURL && returnToURL !== '/'
      ? returnToURL
      : defaultUrl
    dispatchProps.push(redirectUrl)
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    redirectOnSignIn
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

const createDefaultCommunity = graphql(HolochainCreateDefaultCommunityMutation, {
  props: ({ mutate }) => {
    return {
      createDefaultCommunity: () => mutate()
    }
  }
})

export default compose(
  registerHolochainAgent,
  createDefaultCommunity,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)
