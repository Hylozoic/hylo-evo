import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import {
  addCommunityTemplate,
  addDefaultTopic,
  setDefaultTopics,
  removeDefaultTopic,
  fetchCommunityTemplates
} from '../CreateCommunity.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  return {
    communityTemplates: get('communityTemplates', state.CreateCommunity).concat({ id: -1, displayName: 'Other' }),
    defaultTopics: get('defaultTopics', state.CreateCommunity),
    templateId: get('templateId', state.CreateCommunity)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    addCommunityTemplate: (id) => dispatch(addCommunityTemplate(id)),
    addDefaultTopic: (name) => dispatch(addDefaultTopic(name)),
    removeDefaultTopic: (name) => dispatch(removeDefaultTopic(name)),
    setDefaultTopics: (topics) => dispatch(setDefaultTopics(topics)),
    goToNextStep: () => dispatch(push('/create-community/review')),
    goToPreviousStep: () => dispatch(push('/create-community/domain')),
    fetchCommunityTemplates: () => dispatch(fetchCommunityTemplates())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
