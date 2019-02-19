import { get } from 'lodash/fp'
import { textLength } from 'hylo-utils/text'
import { AnalyticsEvents } from 'hylo-utils/constants'
import createPostMutation from 'graphql/mutations/createPostMutation'
import { CREATE_POST } from 'store/constants'

export default function createPost (postParams, query = createPostMutation) {
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
    eventInviteeIds = [],
    startTime,
    endTime
  } = postParams
  const linkPreviewId = linkPreview && linkPreview.id
  const communityIds = communities.map(c => c.id)

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
        eventInviteeIds,
        startTime: startTime.valueOf(),
        endTime: endTime.valueOf()
      }
    },
    meta: {
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
