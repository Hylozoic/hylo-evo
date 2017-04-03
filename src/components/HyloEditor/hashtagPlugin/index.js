import createCompletionPlugin from 'draft-js-autocomplete-plugin-creator'

import hashtagSuggestionsStrategy from './findHashtagSuggestionStrategy'
import hashtagSuggestionsFilter from './hashtagSuggestionsFilter'
import addHashtagModifier from './addHashtagModifier'
import HashtagEntry from './HashtagEntry'

import './hashtagSuggestionsEntryStyles.scss'
import './hashtagSuggestionsStyles.scss'

const createHashtagPlugin = (config = {}) => {
  const defaultTheme = {
    hashtagSuggestions: 'hashtagSuggestions'
  }
  const completionPlugin = createCompletionPlugin(
    hashtagSuggestionsStrategy,
    addHashtagModifier,
    HashtagEntry,
    'hashtagSuggestions'
  )
  const configWithTheme = {
    theme: defaultTheme,
    ...config
  }
  return completionPlugin(configWithTheme)
}

export default createHashtagPlugin

export const defaultSuggestionsFilter = hashtagSuggestionsFilter
