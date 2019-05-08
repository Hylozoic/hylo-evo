import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { postUrl } from 'util/navigation'
import { pick, get } from 'lodash/fp'
import { currentDateString } from 'util/holochain'
import HolochainCommunityQuery from 'graphql/queries/HolochainCommunityQuery.graphql'
import HolochainCreatePostMutation from 'graphql/mutations/HolochainCreatePostMutation.graphql'
import getRouteParam from 'store/selectors/getRouteParam'
import getPostTypeContext from 'store/selectors/getPostTypeContext'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const routeParams = get('match.params', props)
  const postTypeContext = getPostTypeContext(null, props) || getQuerystringParam('t', null, props)

  return {
    currentUser,
    routeParams,
    postTypeContext,
    // not used by holochain
    announcementSelected: null,
    conModerate: null,
    isProject: null,
    isEvent: null,
    linkPreview: null,
    linkPreviewStatus: null,
    fetchLinkPreviewPending: null,
    showImages: null,
    showFiles: null,
    images: null,
    files: null,
    topic: null,
    topicName: null,
    setAnnouncement: () => {},
    pollingFetchLinkPreview: () => {},
    removeLinkPreview: () => {},
    clearLinkPreview: () => {},
    updatePost: () => {},
    createPost: () => {},
    holochainCreatePost: () => {},
    createProject: () => {},
    addImage: () => {},
    addFile: () => {}
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    goToUrl: url => dispatch(push(url))
  }
}

export const currentCommunity = graphql(HolochainCommunityQuery, {
  props: ({ data: { community, loading } }) => ({
    currentCommunity: community,
    post: null,
    communityOptions: [community],
    loading,
    editing: loading
  }),
  options: props => ({
    variables: {
      slug: getRouteParam('slug', {}, props)
    },
    fetchPolicy: 'cache-only'
  })
})

export const createPost = graphql(HolochainCreatePostMutation, {
  props: ({ mutate, ownProps }) => ({
    createPost: post => mutate({
      variables: {
        communitySlug: getRouteParam('slug', {}, ownProps),
        createdAt: currentDateString(),
        ...pick([
          'type',
          'title',
          'details'
        ], post)
      },
      refetchQueries: [{
        query: HolochainCommunityQuery,
        variables: {
          slug: getRouteParam('slug', {}, ownProps)
        }
      }]
    }),
    // postPending: TBD
    goToPost: props => {
      const { slug, postTypeContext } = ownProps.routeParams
      return ownProps.goToUrl(postUrl(props.data.createPost.id, { slug, postTypeContext }))
    }
  })
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  currentCommunity,
  createPost
)
