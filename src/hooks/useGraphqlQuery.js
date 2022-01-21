import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { isString } from 'lodash/fp'
import { FETCH_GRAPHQL } from 'store/constants'

export default function useGraphqlQuery (queryOrOptions, dependencies = []) {
  const dispatch = useDispatch()
  const fetcherParams = { type: FETCH_GRAPHQL }
  
  if (isString(queryOrOptions)) {
    fetcherParams = {
      query: queryOrOptions
    }
  } else {
    fetcherParams = {
      ...queryOrOptions
    }
  }

  // TOOD: Throw if `query` key not present

  useEffect(() => {
    dispatch(graphqlFetcher(fetcherParams))
  }, dependencies)
}

export function graphqlFetcher ({ type = FETCH_GRAPHQL, query, variables }) {
  return {
    type,
    graphql: { query, variables },
    meta
  }
}
