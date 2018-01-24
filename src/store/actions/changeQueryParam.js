import qs from 'querystring'
import { makeUrl } from 'utils/navigation'
import { push, replace } from 'react-router-redux'

export default function changeQueryParam (props, key, value, defaultValue, useReplace) {
  const query = qs.parse(props.location.search.substring(1))
  const newParams = {
    ...query,
    [key]: value === defaultValue ? null : value
  }
  const newUrl = makeUrl(props.location.pathname, newParams)
  return useReplace ? replace(newUrl) : push(newUrl)
}
