import postFieldsFragment from '../fragments/postFieldsFragment'

export default
`mutation (
  $acceptContributions: Boolean,
  $details: String,
  $donationsLink: String,
  $endTime: Date,
  $eventInviteeIds: [ID],
  $fileUrls: [String],
  $groupIds: [ID],
  $id: ID,
  $imageUrls: [String],
  $isAnonymousVote: Boolean,
  $isPublic: Boolean,
  $isStrictProposal: Boolean,
  $linkPreviewFeatured: Boolean,
  $linkPreviewId: String,
  $location: String,
  $locationId: ID,
  $memberIds: [ID],
  $projectManagementLink: String,
  $proposalOptions: [ProposalOptionInput],
  $votingMethod: String,
  $quorum: Int,
  $startTime: Date,
  $timezone: String,
  $title: String,
  $topicNames: [String],
  $type: String,
) {
  updatePost(id: $id, data: {
    acceptContributions: $acceptContributions,
    details: $details,
    donationsLink: $donationsLink,
    endTime: $endTime,
    eventInviteeIds: $eventInviteeIds,
    fileUrls: $fileUrls,
    groupIds: $groupIds,
    imageUrls: $imageUrls,
    isAnonymousVote: $isAnonymousVote,
    isPublic: $isPublic,
    isStrictProposal: $isStrictProposal,
    linkPreviewFeatured: $linkPreviewFeatured,
    linkPreviewId: $linkPreviewId,
    location: $location,
    locationId: $locationId,
    memberIds: $memberIds,
    projectManagementLink: $projectManagementLink,
    proposalOptions: $proposalOptions,
    votingMethod: $votingMethod,
    quorum: $quorum,
    startTime: $startTime,
    timezone: $timezone,
    title: $title,
    topicNames: $topicNames,
    type: $type,
  }) {${postFieldsFragment(false)}}
}`
