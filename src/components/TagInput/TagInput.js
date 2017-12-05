import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { debounce, includes, isEmpty } from 'lodash'
import { uniqBy } from 'lodash/fp'
import cx from 'classnames'
import { getKeyCode, keyMap } from 'util/textInput'
import { KeyControlledItemList } from 'components/KeyControlledList'
import Avatar from 'components/Avatar'

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
    theme: object
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

  resetInput () {
    this.input.value = ''
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
    this.props.handleInputChange(value)
  }, 200)

  render () {
    let { tags, placeholder } = this.props
    const { suggestions, className, theme, readOnly } = this.props
    if (!tags) tags = []
    if (!placeholder) placeholder = 'Type...'

    const selectedItems = uniqBy('id', tags).map(t =>
      <li key={t.id} className={theme.selectedTag}>
        {t.avatar_url && <Avatar person={t} isLink={false} />}
        <span className={theme.selectedTagName}>{t.label || t.name}</span>
        <a onClick={!readOnly && this.remove(t)} className={theme.selectedTagRemove}>&times;</a>
      </li>
    )

    return <div className={cx(theme.root, {[theme.readOnly]: readOnly}, className)} onClick={this.focus}>
      <ul className={theme.selected}>
        {selectedItems}
      </ul>
      <div className={theme.search}>
        <div className={theme.searchInput}>
          <input
            className={theme.searchInput}
            ref={component => { this.input = component }}
            type='text'
            placeholder={placeholder}
            spellCheck={false}
            onChange={event => this.handleChange(event.target.value)}
            onKeyDown={this.handleKeys}
            disabled={readOnly} />
        </div>
        {!isEmpty(suggestions) &&
          <div className={theme.suggestions}>
            <KeyControlledItemList
              items={suggestions}
              onChange={this.select}
              theme={{
                items: theme.suggestions,
                item: theme.suggestion,
                'item-active': theme['suggestion-active']
              }}
              ref={component => { this.list = component }} />
          </div>
        }
      </div>
    </div>
  }
}
