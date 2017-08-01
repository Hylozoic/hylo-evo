import React, { Component } from 'react'
import styles from './Pillbox.scss'
import { getKeyCode, keyMap } from 'util/textInput'
import { debounce, includes, isEmpty, delay } from 'lodash'
import { KeyControlledItemList } from 'components/KeyControlledList'
import cx from 'classnames'

// keys that can be pressed to create a new pill
const creationKeyCodes = [keyMap.ENTER]

export default class Pillbox extends Component {
  constructor (props) {
    super(props)

    this.state = {
      adding: false
    }
  }

  resetInput () {
    this.input.value = ''
    this.props.handleInputChange('')
    this.setState({adding: false})
  }

  handleKeys = event => {
    let { handleAddition, filter } = this.props
    const keyCode = getKeyCode(event)
    const keyWasHandled = this.list && this.list.handleKeys(event)

    if (!keyWasHandled) {
      // if the current input has matching search results, you can press Escape
      // to clear the results.
      if (keyCode === keyMap.ESC) {
        this.resetInput()
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

  focus = () => delay(() => {
    this.input.focus()
  }, 10)

  handleChange = debounce(value => {
    this.props.handleInputChange(value)
  }, 200)

  render () {
    const { addLabel = 'Add', editable } = this.props

    let { pills, placeholder = 'type here', suggestions } = this.props

    let { adding } = this.state

    const addOnClick = () => {
      this.setState({ adding: true })
      this.focus()
    }

    const reset = () => {
      this.resetInput()
    }

    return <div styleName='styles.root'>
      {editable && <div styleName={cx('styles.adding-root', {adding})}>
        <div styleName='styles.search-wrapper'>
          <input
            ref={component => { this.input = component }}
            type='text'
            styleName='styles.search'
            placeholder={placeholder}
            spellCheck={false}
            onChange={event => this.handleChange(event.target.value)}
            onKeyDown={this.handleKeys} />
          <button styleName='styles.close-icon' onClick={reset} type='reset' />
        </div>
        {!isEmpty(suggestions) &&
        <KeyControlledItemList
          items={suggestions}
          theme={{
            items: styles.suggestions,
            item: styles.suggestion,
            'item-active': styles['suggestion-active']
          }}
          onChange={this.select}
          ref={component => { this.list = component }} />
        }
      </div>
      }
      <div styleName='styles.pill-container'>
        {editable && <span styleName='styles.add-btn' onClick={addOnClick}>{addLabel}</span>}
        {pills.map(pill => <Pill key={pill.id} {...pill} editable={editable} />)}
      </div>
    </div>
  }
}

/**
 *
 * @param id
 * @param label
 * @param onRemove called when removing a pill.  Function is passed the ID and LABEL
 * @param className
 * @param small
 * @returns {XML}
 * @constructor
 */
export function Pill ({id, label, onRemove, className, small, editable}) {
  return <div styleName={cx('styles.pill', {'styles.removable': (editable && onRemove), small})}
    className={className}
    onClick={(editable && onRemove) && (() => onRemove(id, label))} >
    <span styleName='styles.displayLabel'>{label}</span>
    {editable && <span styleName='styles.removeLabel'>x</span>}
  </div>
}
