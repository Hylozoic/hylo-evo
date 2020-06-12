import React, { Component } from 'react'
import styles from './Pillbox.scss'
import { getKeyCode, keyMap } from 'util/textInput'
import { debounce, includes, isEmpty, delay } from 'lodash'
import { KeyControlledItemList } from 'components/KeyControlledList'
import cx from 'classnames'
import Icon from 'components/Icon'
import ReactTooltip from 'react-tooltip'
import { CSSTransitionGroup } from 'react-transition-group'

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
      {editable && <div styleName={cx('styles.adding-root', { adding })}>
        <div styleName='styles.search-wrapper'>
          <input
            ref={this.input}
            type='text'
            styleName='styles.search'
            maxLength='21'
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
          ref={this.list} />
        }
      </div>
      }
      <div styleName='styles.pill-container'>
        {editable &&
          <span styleName='styles.add-btn' onClick={addOnClick}>
            {addLabel}
          </span>}
        <CSSTransitionGroup
          transitionName={{
            enter: styles['enter'],
            enterActive: styles['enter-active'],
            leave: styles['leave'],
            leaveActive: styles['leave-active']
          }}
          transitionEnterTimeout={400}
          transitionLeaveTimeout={300}>
          {pills.map(pill =>
            <Pill key={pill.id}
              {...pill}
              handleClick={handleClick}
              editable={editable}
              onRemove={handleDelete} />)}
        </CSSTransitionGroup>
      </div>
      <ReactTooltip place='top'
        type='dark'
        id='pill-remove'
        effect='solid'
        disable={!editable}
        delayShow={500} />
    </div>
  }
}

/**
 * @param id unique ID
 * @param label pill label
 * @param onRemove called when removing a pill.  Function is passed the ID and LABEL
 * @param className a custom classname to apply
 * @param editable allow removing of pills
 */
export class Pill extends Component {
  constructor (props) {
    super(props)

    this.state = { removing: false }
  }

  render () {
    const { id, label, onRemove, className, editable, handleClick } = this.props
    const { removing } = this.state

    const onClick = () => {
      if (editable && onRemove) {
        if (removing) {
          onRemove(id, label)
        } else {
          this.setState({ removing: true })
        }
      }

      if (handleClick) {
        handleClick(id, label)
      }
    }

    const mouseOut = () => {
      this.setState({ removing: false })
    }

    const pillStyles = cx(
      'styles.pill',
      {
        'styles.clickable': !!handleClick,
        'styles.removable': editable && onRemove,
        'styles.removing': editable && onRemove && removing
      }
    )

    return <div styleName={pillStyles}
      className={className}
      data-tip='Click to Remove'
      data-for='pill-remove'
      onClick={onClick}
      onMouseLeave={mouseOut}>
      <span styleName='styles.display-label'>{label}</span>
      {editable && <Icon styleName='styles.remove-label' name='Ex' />}
    </div>
  }
}
