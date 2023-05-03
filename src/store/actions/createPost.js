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
    linkPreviewFeatured,
    imageUrls,
    fileUrls,
    topicNames,
    sendAnnouncement,
    acceptContributions,
    donationsLink,
    projectManagementLink,
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
        linkPreviewFeatured,
        groupIds,
        imageUrls,
        fileUrls,
        announcement: sendAnnouncement,
        topicNames,
        acceptContributions,
        donationsLink,
        projectManagementLink,
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
        groupId: groupIds,
        isAnnouncement: sendAnnouncement,
        isPublic,
        topics: topicNames,
        type
      }
    }
  }
}
