import { get } from 'lodash/fp'
import { FETCH_FOR_GROUP } from 'store/constants'
import groupQueryFragment from '@graphql/fragments/groupQueryFragment'
import groupTopicsQueryFragment from '@graphql/fragments/groupTopicsQueryFragment'

export default function (slug) {
  const query = slug
    ? `query FetchForGroup ($slug: String, $first: Int, $offset: Int, $sortBy: String, $order: String, $autocomplete: String, $subscribed: Boolean, $updateLastViewed: Boolean) {
      ${groupQueryFragment()}
    }`
    : `query ($first: Int, $offset: Int, $sortBy: String, $order: String, $autocomplete: String, $subscribed: Boolean) {
      ${groupTopicsQueryFragment}
    }`

  return {
    type: FETCH_FOR_GROUP,
    graphql: { query, variables: queryVariables(slug) },
    meta: {
      extractModel: slug ? [
        {
          getRoot: get('group'),
          modelName: 'Group',
          append: true
        },
        // XXX: have to do this because i cant figure out how to specify these relationships on the Group model and have them picked up by the ModelExtractor
        {
          getRoot: get('group.groupRelationshipInvitesFrom'),
          modelName: 'GroupRelationshipInvite',
          append: true
        },
        {
          getRoot: get('group.groupRelationshipInvitesTo'),
          modelName: 'GroupRelationshipInvite',
          append: true
        }
      ] : 'GroupTopic',
      slug
    }
  }
}

// the value of `first` is high because we are receiving unaggregated data from
// the API, so there could be many duplicates
const queryVariables = slug => ({ slug, first: 200, offset: 0, subscribed: true, updateLastViewed: true })
