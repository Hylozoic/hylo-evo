import { get } from 'lodash/fp'
import { textLength } from 'hylo-utils/text'
import { AnalyticsEvents } from 'hylo-utils/constants'
import holochainCreatePostMutation from 'graphql/mutations/holochainCreatePostMutation'
import { CREATE_POST } from 'store/constants'

export default function holochainCreatePost (postParams) {
  const {
    type,
    title,
    details,
    communities
  } = postParams

  const communitySlug = get('0.slug', communities)
  if (!communitySlug) throw new Error('must provide CommunitySlug to holochainCreatePost')

  const createdAt = new Date().toISOString()

  return {
    type: CREATE_POST,
    graphql: {
      query: holochainCreatePostMutation,
      variables: {
        type,
        title,
        details,
        communitySlug,
        createdAt
      }
    },
    meta: {
      holochainAPI: true,
      extractModel: {
        modelName: 'Post',
        getRoot: get('createPost')
      },
      analytics: {
        eventName: AnalyticsEvents.POST_CREATED,
        detailsLength: textLength(details)
      },
      // this is used for the queryResults reducer
      communities
    }
  }
}
