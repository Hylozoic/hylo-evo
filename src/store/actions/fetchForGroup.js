import { get } from 'lodash/fp'
import gql from 'graphql-tag'
import { FETCH_FOR_GROUP } from 'store/constants'
import GroupFragment from 'graphql/GroupFragment'
import GroupTopicQuerySetFragment from 'graphql/GroupTopicQuerySetFragment'

export default function (slug) {
  const query = slug
    ? gql`
      query GroupQuery(
        $slug: String
        $first: Int
        $offset: Int
        $sortBy: String
        $order: String
        $autocomplete: String
        $subscribed: Boolean
        $updateLastViewed: Boolean
      ) {
        group(slug: $slug, updateLastViewed: $updateLastViewed) {
          ...GroupFragment
        }
      }
      ${GroupFragment}
    `
    : gql`
      query GroupTopicsQuery3(
        $first: Int
        $offset: Int
        $sortBy: String
        $order: String
        $autocomplete: String
        $subscribed: Boolean
      ) {
        groupTopics(
          first: $first
          offset: $offset
          sortBy: $sortBy
          order: $order
          subscribed: $subscribed
          autocomplete: $autocomplete
        ) {
          ...GroupTopicQuerySetFragment
        }
      }
      ${GroupTopicQuerySetFragment}
    `

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
