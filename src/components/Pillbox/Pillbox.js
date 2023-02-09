import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import isMobile from 'ismobilejs'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { debounce, includes, isEmpty, delay } from 'lodash'
import cx from 'classnames'
import { getKeyCode, keyMap } from 'util/textInput'
import { KeyControlledItemList } from 'components/KeyControlledList'
import Pill from 'components/Pill'
import styles from './Pillbox.scss'

// keys that can be pressed to create a new pill
const creationKeyCodes = [keyMap.ENTER]

export default class Pillbox extends Component {
  constructor (props) {
    super(props)

    this.state = {
      adding: false
    }
    this.input = React.createRef()
    this.list = React.createRef()
  }

  resetInput () {
    this.input.current.value = ''
    this.props.handleInputChange('')
    this.setState({ adding: false })
  }

  handleKeys = event => {
    let { handleAddition, filter } = this.props
    const keyCode = getKeyCode(event)
    const keyWasHandled = this.list.current && this.list.current.handleKeys(event)

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
        handleAddition({ id: value, name: value })
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

  focus = () => delay(() => {
    this.input.current.focus()
  }, 10)

  handleChange = debounce(value => {
    this.props.handleInputChange(value)
  }, 200)

  render () {
    const { addLabel = 'Add', editable, handleClick, handleDelete } = this.props

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
      <div styleName='styles.pill-container'>
        <TransitionGroup>
          {pills.map(pill =>
            <CSSTransition
              key={pill.id}
              classNames={{
                enter: styles['enter'],
                enterActive: styles['enter-active'],
                exit: styles['exit'],
                exitActive: styles['exit-active']
              }}
              timeout={{ enter: 400, exit: 300 }}
            >
              <Pill
                key={pill.id}
                {...pill}
                onClick={handleClick}
                editable={editable}
                onRemove={handleDelete}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
        {editable && <span styleName='styles.add-btn' onClick={addOnClick}>
          {addLabel}
        </span>}
      </div>
      {adding && <div styleName={cx('styles.adding-root')}>
        <div styleName='styles.search-wrapper'>
          <input
            ref={this.input}
            type='text'
            styleName='styles.search'
            maxLength='30'
            placeholder={placeholder}
            spellCheck={false}
            onChange={event => this.handleChange(event.target.value)}
            onKeyDown={this.handleKeys} />
          <button styleName='styles.close-icon' onClick={reset} type='reset' />
        </div>
        {!isEmpty(suggestions) &&
        <KeyControlledItemList
          spaceChooses={false}
          items={suggestions}
          theme={{
            items: styles.suggestions,
            item: styles.suggestion,
            'item-active': styles['suggestion-active']
          }}
          onChange={this.select}
          ref={this.list} />
        }
      </div>}
      {!isMobile.any && (
        <ReactTooltip place='top'
          type='dark'
          id='pill-label'
          effect='solid'
          disable={!editable}
          delayShow={500} />
      )}
    </div>
  }
}
