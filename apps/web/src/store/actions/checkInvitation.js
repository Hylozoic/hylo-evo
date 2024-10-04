import { CHECK_INVITATION } from 'store/constants'

export default function checkInvitation (inviteCodes) {
  const { invitationToken, accessCode } = inviteCodes
  return {
    type: CHECK_INVITATION,
    graphql: {
      query: `
        query CheckInvitation ($invitationToken: String, $accessCode: String) {
          checkInvitation (invitationToken: $invitationToken, accessCode: $accessCode) {
            valid
          }
        }
      `,
      variables: {
        invitationToken,
        accessCode
      }
    }
  }
}
