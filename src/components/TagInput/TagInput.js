import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { debounce, includes, isEmpty } from 'lodash'
import { uniqBy } from 'lodash/fp'
import cx from 'classnames'
import { getKeyCode, keyMap } from 'util/textInput'
import { KeyControlledItemList } from 'components/KeyControlledList'
import Avatar from 'components/Avatar'
import styles from './TagInput.scss'

const { object, array, bool, string, func } = PropTypes

// keys that can be pressed to create a new tag
const creationKeyCodes = [keyMap.ENTER, keyMap.SPACE, keyMap.COMMA]

export default class TagInput extends Component {
  static propTypes = {
    tags: array,
    type: string,
    suggestions: array,
    handleInputChange: func.isRequired,
    handleAddition: func,
    handleDelete: func,
    allowNewTags: bool,
    placeholder: string,
    filter: func,
    readOnly: bool,
    className: string,
    theme: object,
    addLeadingHashtag: bool,
    renderSuggestion: func
  }

  static defaultProps = {
    theme: {
      root: 'root',
      selected: 'selected',
      selectedTag: 'selectedTag',
      selectedTagName: 'selectedTagName',
      selectedTagRemove: 'selectedTagRemove',
      search: 'search',
      searchInput: 'searchInput',
      suggestions: 'suggestions',
      suggestionsList: 'suggestionsList',
      suggestion: 'suggestion',
      readOnly: 'readOnly'
    }
  }

  resetInput = () => {
    if (this.input) this.input.value = ''
    this.props.handleInputChange('')
  }

  handleKeys = event => {
    let { allowNewTags, handleAddition, handleInputChange, filter } = this.props
    const keyCode = getKeyCode(event)
    const keyWasHandled = this.list && this.list.handleKeys(event)

    if (!keyWasHandled && allowNewTags) {
      // if the current input has matching search results, you can press Escape
      // to clear the results.
      if (keyCode === keyMap.ESC) {
        handleInputChange('')
        return
      }

      // if there are no matches, or there are matches but none has been
      // selected yet, you can also press any key listed in creationKeyCodes to
      // create a tag based on what you've typed so far.
      if (includes(creationKeyCodes, keyCode)) {
        let { value } = event.target
        if (!value) return
        handleAddition({id: value, name: value})
        this.resetInput()
        event.preventDefault()
        return
      }
    }

    if (filter) filter(event)
  }

  select = choice => {
    this.props.handleAddition(choice)
    this.resetInput()
  }

  remove = tag => event => {
    this.props.handleDelete(tag)
    event.preventDefault()
  }

  focus = () => {
    this.input.focus()
  }

  handleChange = debounce(value => {
    const strippedValue = this.props.stripInputHashtag ? value.replace(/^#/, '') : value
    this.props.handleInputChange(strippedValue)
  }, 200)

  render () {
    let { tags, placeholder } = this.props
    const { suggestions, className, theme, readOnly, maxTags, addLeadingHashtag, renderSuggestion } = this.props
    if (!tags) tags = []
    if (!placeholder) placeholder = 'Type...'

    const optionalHashtag = addLeadingHashtag ? '#' : ''

    const selectedItems = uniqBy('id', tags).map(t =>
      <li key={t.id} className={theme.selectedTag}>
        {t.avatar_url && <Avatar person={t} isLink={false} />}
        <span className={theme.selectedTagName}>{optionalHashtag}{t.label || t.name}</span>
        <a onClick={!readOnly ? this.remove(t) : undefined} className={theme.selectedTagRemove}>&times;</a>
      </li>
    )

    const maxReached = maxTags && selectedItems.length >= maxTags

    // this is so the suggestion list can do double duty as an error message
    const suggestionsOrError = maxReached
      ? isEmpty(this.input.value)
        ? []
        : [{name: `no more than ${maxTags} allowed`}]
      : suggestions

    return <div className={cx(theme.root, {[theme.readOnly]: readOnly}, className)} onClick={this.focus}>
      <ul className={theme.selected}>
        {selectedItems}
      </ul>
      <div className={theme.search}>
        <div className={theme.searchInput}>
          <input
            className={theme.searchInput}
            styleName={cx({'error': maxReached})}
            ref={component => { this.input = component }}
            type='text'
            placeholder={placeholder}
            spellCheck={false}
            onChange={event => this.handleChange(event.target.value)}
            onKeyDown={this.handleKeys}
            disabled={readOnly} />
        </div>
        {!isEmpty(suggestionsOrError) &&
          <div className={theme.suggestions}>
            <KeyControlledItemList
              items={suggestionsOrError}
              renderListItem={renderSuggestion}
              onChange={maxReached ? this.resetInput : this.select}
              theme={{
                items: theme.suggestions,
                item: cx(theme.suggestion, {[styles.error]: maxReached}),
                'item-active': theme['suggestion-active']
              }}
              ref={component => { this.list = component }} />
          </div>
        }
      </div>
    </div>
  }
}
