import { get } from 'lodash/fp'
import { TextHelpers, AnalyticsEvents } from 'hylo-shared'
import updatePostMutation from 'graphql/mutations/updatePostMutation'
import { UPDATE_POST } from 'store/constants'

export default function updatePost (post, query = updatePostMutation) {
  const {
    id,
    type,
    title,
    details,
    groups,
    linkPreview,
    linkPreviewFeatured,
    imageUrls,
    fileUrls,
    topicNames,
    memberIds,
    acceptContributions,
    donationsLink,
    projectManagementLink,
    eventInviteeIds = [],
    startTime,
    endTime,
    location,
    locationId,
    isPublic
  } = post
  const linkPreviewId = linkPreview && linkPreview.id
  const groupIds = groups.map(g => g.id)

  return {
    type: UPDATE_POST,
    graphql: {
      query,
      variables: {
        id,
        type,
        title,
        details,
        linkPreviewId,
        linkPreviewFeatured,
        groupIds,
        imageUrls,
        fileUrls,
        topicNames,
        memberIds,
        acceptContributions,
        donationsLink,
        projectManagementLink,
        eventInviteeIds,
        startTime: startTime && startTime.valueOf(),
        endTime: endTime && endTime.valueOf(),
        location,
        locationId,
        isPublic
      }
    },
    meta: {
      id,
      extractModel: {
        modelName: 'Post',
        getRoot: get('updatePost'),
        append: false
      },
      optimistic: true,
      analytics: {
        eventName: AnalyticsEvents.POST_UPDATED,
        detailsLength: TextHelpers.textLengthHTML(details),
        groupId: groupIds,
        isPublic,
        topics: topicNames,
        type
      }
    }
  }
}
