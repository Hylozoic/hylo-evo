import { get } from 'lodash/fp'
import { textLength } from 'hylo-utils/text'
import { AnalyticsEvents } from 'hylo-utils/constants'
import CreatePostMutation from 'graphql/mutations/CreatePostMutation'
import { CREATE_POST } from 'store/constants'

export default function createPost (postParams) {
  const query = CreatePostMutation

  const {
    type,
    title,
    details,
    groups,
    linkPreview,
    imageUrls,
    fileUrls,
    topicNames,
    sendAnnouncement,
    acceptContributions,
    eventInviteeIds = [],
    memberIds = [],
    startTime,
    endTime,
    location,
    locationId,
    isPublic
  } = postParams
  const linkPreviewId = linkPreview && linkPreview.id
  const groupIds = groups.map(c => c.id)

  return {
    type: CREATE_POST,
    graphql: {
      query,
      variables: {
        type,
        title,
        details,
        linkPreviewId,
        groupIds,
        imageUrls,
        fileUrls,
        announcement: sendAnnouncement,
        topicNames,
        acceptContributions,
        eventInviteeIds,
        memberIds,
        startTime: startTime && startTime.valueOf(),
        endTime: endTime && endTime.valueOf(),
        location,
        locationId,
        isPublic
      }
    },
    meta: {
      extractModel: {
        modelName: 'Post',
        getRoot: get('createPost')
      },
      analytics: {
        eventName: AnalyticsEvents.POST_CREATED,
        detailsLength: textLength(details),
        isAnnouncement: sendAnnouncement
      }
    }
  }
}
