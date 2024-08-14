export const FETCH_PLATFORM_AGREEMENTS = 'FETCH_PLATFORM_AGREEMENTS'

export default function fetchPlatformAgreements () {
  return {
    type: FETCH_PLATFORM_AGREEMENTS,
    graphql: {
      query: `query FetchPlatformAgreements {
        platformAgreements {
            id
            text
            type
        }
      }`,
      variables: { }
    },
    meta: {
      extractModel: 'PlatformAgreement'
    }
  }
}
