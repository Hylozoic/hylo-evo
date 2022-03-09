import { get } from 'lodash/fp'
import { TextHelpers, AnalyticsEvents } from 'hylo-shared'
import createPostMutation from 'graphql/mutations/createPostMutation'
import { CREATE_POST } from 'store/constants'

export default function createPost (postParams) {
  const query = createPostMutation

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
        detailsLength: TextHelpers.textLengthHTML(details),
        isAnnouncement: sendAnnouncement
      }
    }
  }
}
