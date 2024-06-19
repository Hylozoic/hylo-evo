import { get } from 'lodash/fp'
import { TextHelpers, AnalyticsEvents } from 'hylo-shared'
import createPostMutation from 'graphql/mutations/createPostMutation'
import { CREATE_POST } from 'store/constants'

export default function createPost (postParams) {
  const query = createPostMutation

  const {
    acceptContributions,
    details,
    donationsLink,
    endTime,
    eventInviteeIds = [],
    fileUrls,
    groups,
    imageUrls,
    linkPreview,
    linkPreviewFeatured,
    location,
    locationId,
    memberIds = [],
    isAnonymousVote,
    isPublic,
    isStrictProposal,
    projectManagementLink,
    proposalOptions,
    votingMethod,
    quorum,
    sendAnnouncement,
    startTime,
    timezone,
    title,
    topicNames,
    type
  } = postParams
  const linkPreviewId = linkPreview && linkPreview.id
  const groupIds = groups.map(c => c.id)

  return {
    type: CREATE_POST,
    graphql: {
      query,
      variables: {
        acceptContributions,
        announcement: sendAnnouncement,
        details,
        donationsLink,
        endTime: endTime && endTime.valueOf(),
        eventInviteeIds,
        fileUrls,
        groupIds,
        imageUrls,
        isAnonymousVote,
        isPublic,
        isStrictProposal,
        linkPreviewId,
        linkPreviewFeatured,
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
