export const slugValidatorRegex = /^[0-9a-z-]{2,40}$/

export function formatDomainWithUrl (communityDomain) {
  let formattedDomain = communityDomain.replace(/hylo\.com\/c\/?/, '')
  if (formattedDomain !== '') {
    formattedDomain = 'hylo.com/c/' + formattedDomain
  }
  return formattedDomain
}

export function removeUrlFromDomain (communityDomain) {
  return communityDomain.replace('hylo.com/c/', '')
}

export const invalidSlugMessage = 'URLs must have between 2 and 40 characters, and can only have lower case letters, numbers, and dashes.'
