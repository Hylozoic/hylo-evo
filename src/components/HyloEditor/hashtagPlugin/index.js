import createCompletionPlugin from 'draft-js-autocomplete-plugin-creator'

import findHashtagSuggestionStrategy from './findHashtagSuggestionStrategy'
import findHashtagEntitiesStrategy from './findHashtagEntitiesStrategy'
import hashtagSuggestionsFilter from './hashtagSuggestionsFilter'
import addHashtagModifier from './addHashtagModifier'
import HashtagEntry from './HashtagEntry'
import Hashtag from './Hashtag'

import './hashtagSuggestionsEntryStyles.scss'
import './hashtagSuggestionsStyles.scss'

// import decorateComponentWithProps from 'decorate-component-with-props'

const HashtagSpan = (props) => {
  const styles = {
    hashtag: {
      color: 'rgba(95, 184, 138, 1.0)'
    }
  }
  return (
    <span
      style={styles.hashtag}
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  )
}

// const ColorComponent = (props) => {
//   return (
//     <span className='testcolor'>{props.children}</span>
//   )
// }

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
        component: HashtagSpan
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
