import qs from 'querystring'
import { addQuerystringToPath } from 'util/navigation'
import { push, replace } from 'react-router-redux'

export default function changeQuerystringParam (props, key, value, defaultValue, useReplace) {
  const querystringParams = qs.parse(props.location.search.substring(1))
  const newQuerystringParams = {
    ...querystringParams,
    [key]: value === defaultValue ? null : value
  }
  const newUrl = addQuerystringToPath(props.location.pathname, newQuerystringParams)
  return useReplace ? replace(newUrl) : push(newUrl)
}
