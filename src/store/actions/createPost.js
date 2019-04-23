import { get } from 'lodash/fp'
import { textLength } from 'hylo-utils/text'
import { AnalyticsEvents } from 'hylo-utils/constants'
import createPostMutation from 'graphql/mutations/createPostMutation'
import holochainCreatePostMutation from 'graphql/mutations/holochainCreatePostMutation'
import { CREATE_POST } from 'store/constants'

export default function createPost (postParams, holochainAPI = false) {
  const query = holochainAPI ? holochainCreatePostMutation : createPostMutation

  const {
    type,
    title,
    details,
    communities,
    linkPreview,
    imageUrls,
    fileUrls,
    topicNames,
    sendAnnouncement,
    networkSlug,
    acceptContributions,
    eventInviteeIds = [],
    startTime,
    endTime,
    location
  } = postParams
  const linkPreviewId = linkPreview && linkPreview.id
  const communityIds = communities.map(c => c.id)

  // for holochain
  const base = communities[0].slug

  return {
    type: CREATE_POST,
    graphql: {
      query,
      variables: {
        type,
        title,
        details,
        linkPreviewId,
        communityIds,
        imageUrls,
        fileUrls,
        announcement: sendAnnouncement,
        topicNames,
        acceptContributions,
        eventInviteeIds,
        startTime: startTime && startTime.valueOf(),
        endTime: endTime && endTime.valueOf(),
        location,
        base
      }
    },
    meta: {
      holochainAPI,
      extractModel: {
        modelName: 'Post',
        getRoot: get('createPost')
      },
      networkSlug,
      analytics: {
        eventName: AnalyticsEvents.POST_CREATED,
        detailsLength: textLength(details),
        isAnnouncement: sendAnnouncement
      }
    }
  }
}
