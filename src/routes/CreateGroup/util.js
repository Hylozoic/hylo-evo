export const slugValidatorRegex = /^[0-9a-z-]{2,40}$/

export function formatDomainWithUrl (groupDomain) {
  let formattedDomain = groupDomain.replace(/hylo\.com\/c\/?/, '')
  if (formattedDomain !== '') {
    formattedDomain = 'hylo.com/g/' + formattedDomain
  }
  return formattedDomain
}

export function removeUrlFromDomain (groupDomain) {
  return groupDomain.replace('hylo.com/g/', '')
}

export const invalidSlugMessage = 'URLs must have between 2 and 40 characters, and can only have lower case letters, numbers, and dashes.'
