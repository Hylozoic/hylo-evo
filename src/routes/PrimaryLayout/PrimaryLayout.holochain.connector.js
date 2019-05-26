import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { get } from 'lodash/fp'
import mobileRedirect from 'util/mobileRedirect'
import { HOLOCHAIN_POLL_INTERVAL_SLOW } from 'util/holochain'
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
    fetchForCommunity: () => {},
    fetchForCurrentUser: () => {}
  }
}

export const mapDispatchToProps = {
  fetchForCurrentUserMock,
  toggleDrawer
}

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
    pollInterval: HOLOCHAIN_POLL_INTERVAL_SLOW
  }
})

const currentUserFromHolochainAgent = graphql(HolochainCurrentUserQuery, {
  skip: props => props.currentUser || props.holochainAgent,
  props: ({ data: { me: holochainAgent }, ownProps: { fetchForCurrentUserMock } }) => {
    // * Merges Holochain Agent data into the Redux ORM CurrentUser mock
    fetchForCurrentUserMock(holochainAgent)
    return {
      holochainAgent
    }
  }
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  currentUserFromHolochainAgent,
  community
)
