import qs from 'querystring'
import { addQuerystringToPath } from 'util/navigation'
import { push, replace } from 'connected-react-router'

export default function changeQuerystringParam (props, key, value, defaultValue, useReplace) {
  const querystringParams = qs.parse(props.location.search.substring(1))
  const newQuerystringParams = {
    ...querystringParams,
    [key]: value === null ? defaultValue : value
  }
  const newUrl = addQuerystringToPath(props.location.pathname, newQuerystringParams)
  return useReplace ? replace(newUrl) : push(newUrl)
}

export function changeQuerystringParams (props, newParams, useReplace) {
  const querystringParams = qs.parse(props.location.search.substring(1))
  const newQuerystringParams = {
    ...querystringParams,
    ...newParams
  }
  const newUrl = addQuerystringToPath(props.location.pathname, newQuerystringParams)
  return useReplace ? replace(newUrl) : push(newUrl)
}
