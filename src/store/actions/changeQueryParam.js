import qs from 'querystring'
import { makeUrl } from 'util/navigation'
import { push } from 'react-router-redux'

export default function changeQueryParam (props, key, value, defaultValue) {
  const query = qs.parse(props.location.search.substring(1))
  const newParams = {
    ...query,
    [key]: value === defaultValue ? null : value
  }
  const newUrl = makeUrl(props.location.pathname, newParams)
  return push(newUrl)
}
