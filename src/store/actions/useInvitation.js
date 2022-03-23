import { get } from 'lodash/fp'
import { USE_INVITATION } from 'store/constants'
import { AnalyticsEvents } from 'hylo-shared'

export default function useInvitation (inviteCodes = {}) {
  const { invitationToken, accessCode } = inviteCodes

  return {
    type: USE_INVITATION,
    graphql: {
      query: `
        mutation UseInvitation ($invitationToken: String, $accessCode: String) {
          useInvitation (invitationToken: $invitationToken, accessCode: $accessCode) {
            membership {
              id
              role
              group {
                id
                accessibility
                name
                settings {
                  allowGroupInvites
                  askJoinQuestions
                  askGroupToGroupJoinQuestions
                  publicMemberDirectory
                  showSuggestedSkills
                }
                slug
                visibility
              }
              person {
                id
              }
              settings {
                showJoinForm
              }
            }
            error
          }
        }
      `,
      variables: {
        invitationToken,
        accessCode
      }
    },
    meta: {
      extractModel: {
        modelName: 'Membership',
        getRoot: get('useInvitation.membership')
      },
      analytics: AnalyticsEvents.GROUP_INVITATION_ACCEPTED
    }
  }
}
