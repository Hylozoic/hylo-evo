import createCompletionPlugin from 'draft-js-autocomplete-plugin-creator'

import findHashtagSuggestionStrategy from './findHashtagSuggestionStrategy'
import findHashtagEntitiesStrategy from './findHashtagEntitiesStrategy'
import hashtagSuggestionsFilter from './hashtagSuggestionsFilter'
import addHashtagModifier from './addHashtagModifier'
import HashtagEntry from './HashtagEntry'
import Hashtag from './Hashtag'

import './hashtagSuggestionsStyles.scss'

import decorateComponentWithProps from 'decorate-component-with-props'

const createHashtagPlugin = (config = {}) => {
  const defaultTheme = {
    hashtagSuggestions: 'hashtagSuggestions',
    hashtag: 'hashtag'
  }
  const completionPlugin = createCompletionPlugin(
    findHashtagSuggestionStrategy,
    addHashtagModifier,
    HashtagEntry,
    'hashtagSuggestions',
    [
      {
        strategy: findHashtagEntitiesStrategy,
        component: decorateComponentWithProps(Hashtag, { theme: defaultTheme })
      }
    ]
  )
  const configWithTheme = {
    theme: defaultTheme,
    ...config
  }
  return completionPlugin(configWithTheme)
}

export default createHashtagPlugin

export const defaultSuggestionsFilter = hashtagSuggestionsFilter
