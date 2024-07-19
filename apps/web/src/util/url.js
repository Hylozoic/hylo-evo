import { isURL } from 'validator'

export const sanitizeURL = (url) => {
  if (!url) return null
  if (isURL(url, { require_protocol: true })) return url
  if (isURL(`https://${url}`)) return `https://${url}`
  return null
}
