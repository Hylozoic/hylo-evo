import { get } from 'lodash/fp'
import { textLength } from 'hylo-utils/text'
import { AnalyticsEvents } from 'hylo-utils/constants'
import updatePostMutation from 'graphql/mutations/updatePostMutation'
import { UPDATE_POST } from 'store/constants'

export default function updatePost (post, query = updatePostMutation) {
  const {
    id,
    type,
    title,
    details,
    communities,
    linkPreview,
    imageUrls,
    fileUrls,
    topicNames,
    memberIds,
    acceptContributions,
    eventInviteeIds = [],
    startTime,
    endTime,
    location,
    locationId,
    isPublic
  } = post
  const linkPreviewId = linkPreview && linkPreview.id
  const communityIds = communities.map(c => c.id)

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
        communityIds,
        imageUrls,
        fileUrls,
        topicNames,
        memberIds,
        acceptContributions,
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
        detailsLength: textLength(details)
      }
    }
  }
}
