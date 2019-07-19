import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import {
  HOLOCHAIN_DEFAULT_COMMUNITY_NAME,
  HOLOCHAIN_DEFAULT_COMMUNITY_SLUG
} from 'util/holochain'
import HolochainRegisterUserMutation from 'graphql/mutations/HolochainRegisterUserMutation.graphql'
import HolochainCreateCommunityMutation from 'graphql/mutations/HolochainCreateCommunityMutation.graphql'
import { setLogin } from '../Login/Login.store'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'

export function mapStateToProps (state) {
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

const createDefaultCommunity = graphql(HolochainCreateCommunityMutation, {
  props: ({ mutate }) => ({
    createDefaultCommunity: () => mutate({
      variables: {
        slug: HOLOCHAIN_DEFAULT_COMMUNITY_SLUG,
        name: HOLOCHAIN_DEFAULT_COMMUNITY_NAME
      }
    })
  })
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  registerHolochainAgent,
  createDefaultCommunity
)
