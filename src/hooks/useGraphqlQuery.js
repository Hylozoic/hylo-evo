import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { isString } from 'lodash/fp'
import { FETCH_GRAPHQL } from 'store/constants'

export default function useGraphqlQuery (queryOrFetchParams, dependencies = []) {
  const dispatch = useDispatch()
  // Values here will trump anything provided in queryOrFetchParams
  let fetchParams = { type: FETCH_GRAPHQL }

  if (isString(queryOrFetchParams)) {
    fetchParams.graphql = { query: queryOrFetchParams }
  } else {
    fetchParams = {
      ...queryOrFetchParams,
      ...fetchParams
    }
  }

  // TOOD: Throw here if `query` key not present

  useEffect(() => {
    dispatch(fetchParams)
  }, dependencies)
}
