import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { get } from 'lodash/fp'
import mobileRedirect from 'util/mobileRedirect'
import HolochainRegisterUserMutation from 'graphql/mutations/HolochainRegisterUserMutation.graphql'
import HolochainCommunityQuery from 'graphql/queries/HolochainCommunityQuery.graphql'
import HolochainCurrentUserQuery from 'graphql/queries/HolochainCurrentUserQuery.graphql'
import fetchForCurrentUserMock from 'store/actions/fetchForCurrentUserMock'
import isCommunityRoute, { getSlugFromLocation } from 'store/selectors/isCommunityRoute'
import getMe from 'store/selectors/getMe'
import { getReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import { toggleDrawer } from './PrimaryLayout.store'

export function mapStateToProps (state, props) {
  const slug = getSlugFromLocation(null, props)

  return {
    currentUser: getMe(state),
    slug,
    returnToURL: getReturnToURL(state),
    isCommunityRoute: isCommunityRoute(state, props),
    downloadAppUrl: mobileRedirect(),
    isDrawerOpen: get('PrimaryLayout.isDrawerOpen', state),
    showLogoBadge: false,
    // not used by holochain
    fetchForCommunity: () => {}
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    fetchForCurrentUser: (holochainUserData) =>
      dispatch(fetchForCurrentUserMock(holochainUserData)),
    toggleDrawer: () => dispatch(toggleDrawer())
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser } = ownProps
  const fetchForCurrentUser = () => dispatchProps.fetchForCurrentUser(currentUser)
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchForCurrentUser
  }
}

const registerHolochainAgent = graphql(HolochainRegisterUserMutation, {
  props: ({ mutate }) => {
    return {
      registerHolochainAgent: variables => mutate({
        variables
      })
    }
  }
})

const community = graphql(HolochainCommunityQuery, {
  skip: props => !props.currentUser || !props.slug,
  props: ({ data: { community, loading } }) => ({
    community: community || {},
    communityPending: loading
  }),
  variables: props => ({
    slug: props.slug
  }),
  options: {
    pollInterval: 30000
  }
})

const currentUser = graphql(HolochainCurrentUserQuery, {
  skip: props => !!props.currentUser,
  props: ({ data: { me } }) => {
    return {
      currentUser: me
    }
  }
})

export default compose(
  currentUser,
  registerHolochainAgent,
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  community
)
