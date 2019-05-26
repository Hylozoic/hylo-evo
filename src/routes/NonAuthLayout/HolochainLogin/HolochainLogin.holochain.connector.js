import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { get } from 'lodash/fp'
import { setLogin } from '../Login/Login.store'
import HolochainRegisterUserMutation from 'graphql/mutations/HolochainRegisterUserMutation.graphql'
import HolochainCreateDefaultCommunityMutation from 'graphql/mutations/HolochainCreateDefaultCommunityMutation.graphql'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import fetchForCurrentUserMock from 'store/actions/fetchForCurrentUserMock'

export function mapStateToProps (state, props) {
  return {
    returnToURL: getReturnToURL(state)
  }
}

export const mapDispatchToProps = {
  resetReturnToURL,
  push,
  setLogin,
  // this is used to set currentUser in the redux store from the result of registerHolochainAgent
  fetchForCurrentUserMock
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
  props: ({ mutate, ownProps }) => {
    return {
      registerHolochainAgent: async (name, avatarUrl) => {
        const registeredAgentPayload = await mutate({
          variables: {
            name,
            avatarUrl
          }
        })
        const currentUser = get('data.registerUser', registeredAgentPayload)

        // set currentUser in redux store
        await ownProps.fetchForCurrentUserMock(currentUser)

        return registeredAgentPayload
      }
    }
  }
})

const createDefaultCommunity = graphql(HolochainCreateDefaultCommunityMutation, {
  name: 'createDefaultCommunity'
})

export default compose(
  registerHolochainAgent,
  createDefaultCommunity,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)
