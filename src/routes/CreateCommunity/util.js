export const slugValidatorRegex = /^[0-9a-z\s-]+$/

export function formatDomainWithUrl (communityDomain) {
  let formattedDomain = communityDomain.replace('hylo.com/c/', '').replace('hylo.com/c', '')
  if (formattedDomain !== '') {
    formattedDomain = 'hylo.com/c/' + formattedDomain
  }
  return formattedDomain
}

export function removeUrlFromDomain (communityDomain) {
  return communityDomain.replace('hylo.com/c/', '')
}
