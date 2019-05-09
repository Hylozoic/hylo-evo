import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { get } from 'lodash/fp'
import HolochainCommunityQuery from 'graphql/queries/HolochainCommunityQuery.graphql'
import { toggleDrawer } from './PrimaryLayout.store'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import getMe from 'store/selectors/getMe'
import getHolochainActive from 'store/selectors/getHolochainActive'
import isCommunityRoute, { getSlugFromLocation } from 'store/selectors/isCommunityRoute'
import { getReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import mobileRedirect from 'util/mobileRedirect'

export function mapStateToProps (state, props) {
  const slug = getSlugFromLocation(null, props)

  return {
    currentUser: getMe(state),
    slug,
    returnToURL: getReturnToURL(state),
    holochainActive: getHolochainActive(state),
    isCommunityRoute: isCommunityRoute(state, props),
    downloadAppUrl: mobileRedirect(),
    isDrawerOpen: get('PrimaryLayout.isDrawerOpen', state),
    showLogoBadge: false,
    fetchForCommunity: () => {}
  }
}

export function mapDispatchToProps (dispatch, props) {
  const slug = getSlugFromLocation(null, props)

  return {
    fetchForCurrentUser: () => dispatch(fetchForCurrentUser(slug)),
    toggleDrawer: () => dispatch(toggleDrawer())
  }
}

const community = graphql(HolochainCommunityQuery, {
  skip: props => !props.slug,
  props: ({ data: { community, loading } }) => ({
    community,
    communityPending: loading
  }),
  variables: props => ({
    slug: props.slug
  }),
  options: {
    pollInterval: 30000
  }
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  community
)
