
import qs from 'querystring'
import { FETCH_LINK_PREVIEW } from 'store/actions'

export function fetchLinkPreview (url) {
  const q = qs.stringify({url})
  return {
    type: FETCH_LINK_PREVIEW,
    payload: {api: true, path: `/noo/link-preview?${q}`}
  }
}
