import { get } from 'lodash/fp'
import { TextHelpers, AnalyticsEvents } from 'hylo-shared'
import updatePostMutation from '@graphql/mutations/updatePostMutation'
import { UPDATE_POST } from 'store/constants'

export default function updatePost (post, query = updatePostMutation) {
  const {
    acceptContributions,
    details,
    donationsLink,
    endTime,
    eventInviteeIds = [],
    fileUrls,
    groups,
    id,
    imageUrls,
    isAnonymousVote,
    isPublic,
    isStrictProposal,
    linkPreview,
    linkPreviewFeatured,
    location,
    locationId,
    memberIds,
    projectManagementLink,
    proposalOptions,
    votingMethod,
    quorum,
    startTime,
    timezone,
    title,
    topicNames,
    type
  } = post
  const linkPreviewId = linkPreview && linkPreview.id
  const groupIds = groups.map(g => g.id)

  return {
    type: UPDATE_POST,
    graphql: {
      query,
      variables: {
        acceptContributions,
        details,
        donationsLink,
        endTime: endTime && endTime.valueOf(),
        eventInviteeIds,
        fileUrls,
        groupIds,
        id,
        imageUrls,
        isAnonymousVote,
        isPublic,
        isStrictProposal,
        linkPreviewFeatured,
        linkPreviewId,
        location,
        locationId,
        memberIds,
        projectManagementLink,
        proposalOptions,
        votingMethod,
        quorum,
        startTime: startTime && startTime.valueOf(),
        timezone,
        title,
        topicNames,
        type
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
