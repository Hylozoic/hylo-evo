import { useMemo } from 'react'
import {
  useParams,
  useLocation
} from 'react-router-dom'
import queryString from 'query-string'

export default function useRouterParams () {
  const params = useParams()
  const location = useLocation()

  // Mix query params and path params into one object, query params take precedence
  return useMemo(() => {
    return {
      ...queryString.parse(location.search), // Convert string to object
      ...params
    }
  }, [params, location])
}
