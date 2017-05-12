import createCompletionPlugin from 'draft-js-autocomplete-plugin-creator'

import findTopicSuggestionStrategy from './findTopicSuggestionStrategy'
import findTopicEntitiesStrategy from './findTopicEntitiesStrategy'
import topicSuggestionsFilter from './topicSuggestionsFilter'
import addTopicModifier from './addTopicModifier'
import TopicEntry from './TopicEntry'
import Topic from './Topic'

import './topicSuggestionsStyles.scss'

import decorateComponentWithProps from 'decorate-component-with-props'

const createTopicPlugin = (config = {}) => {
  const defaultTheme = {
    topicSuggestions: 'topicSuggestions',
    topic: 'topic'
  }
  const completionPlugin = createCompletionPlugin(
    findTopicSuggestionStrategy,
    addTopicModifier,
    TopicEntry,
    'topicSuggestions',
    [
      {
        strategy: findTopicEntitiesStrategy,
        component: decorateComponentWithProps(Topic, { theme: defaultTheme })
      }
    ]
  )
  const configWithTheme = {
    theme: defaultTheme,
    ...config
  }
  return completionPlugin(configWithTheme)
}

export default createTopicPlugin

export const defaultSuggestionsFilter = topicSuggestionsFilter
