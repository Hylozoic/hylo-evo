import { connect } from 'react-redux'
import {
  fetchCommunity
} from './TopicNavigation.store'
import { get } from 'lodash/fp'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getCommunityFromSlug = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => get('slug', props),
  (session, slug) => {
    try {
      return session.Community.get({slug})
    } catch (e) {
      return null
    }
  }
)

const SAMPLE_TOPICS = [
  {name: 'petitions', badge: 2},
  {name: 'freebies'},
  {name: 'press', badge: 2},
  {name: 'inspiration'},
  {name: 'vent'},
  {name: 'question'},
  {name: 'progress'}
]

export function mapStateToProps (state, props) {
  const community = getCommunityFromSlug(state, props)
  community && community.topicSubscriptions && console.log('topics', community.topicSubscriptions.toModelArray())
  return {
    topics: SAMPLE_TOPICS
  }
}

export function mapDispatchToProps (dispatch, { slug }) {
  return {
    fetchCommunity: slug ? () => dispatch(fetchCommunity(slug)) : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
