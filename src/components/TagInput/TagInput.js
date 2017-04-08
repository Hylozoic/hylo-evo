import React from 'react'
import { debounce, includes, isEmpty } from 'lodash'
import { uniqBy } from 'lodash/fp'
import cx from 'classnames'
import { KeyControlledItemList } from 'components/KeyControlledList'
import { getKeyCode, keyMap } from 'util/textInput'
import Avatar from 'components/Avatar'

const { array, bool, string, func } = React.PropTypes

// keys that can be pressed to create a new tag
const creationKeyCodes = [keyMap.ENTER, keyMap.SPACE, keyMap.COMMA]

export default class TagInput extends React.Component {
  static propTypes = {
    tags: array,
    type: string,
    choices: array,
    handleInputChange: func.isRequired,
    handleAddition: func,
    handleDelete: func,
    allowNewTags: bool,
    placeholder: string,
    filter: func,
    className: string
  }

  resetInput () {
    this.refs.input.value = ''
    this.props.handleInputChange('')
  }

  handleKeys = event => {
    let { allowNewTags, handleAddition, handleInputChange, filter } = this.props
    const keyCode = getKeyCode(event)
    const keyWasHandled = this.refs.list && this.refs.list.handleKeys(event)

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
    this.refs.input.focus()
  }

  handleChange = debounce(value => {
    this.props.handleInputChange(value)
  }, 200)

  render () {
    let { tags, placeholder } = this.props
    const { choices, className } = this.props
    if (!tags) tags = []
    if (!placeholder) placeholder = 'Type...'
    return <div className={cx('tag-input', className)} onClick={this.focus}>
      <ul>
        {uniqBy('id', tags).map(t => <li key={t.id} className='tag'>
          {t.avatar_url && <Avatar person={t} isLink={false} />}
          {t.label || t.name}
          <a onClick={this.remove(t)} className='remove'>&times;</a>
        </li>)}
      </ul>

      <input ref='input' type='text' placeholder={placeholder} spellCheck={false}
        onChange={event => this.handleChange(event.target.value)}
        onKeyDown={this.handleKeys} />

      {!isEmpty(choices) && <div className='dropdown'>
        <KeyControlledItemList className='dropdown-menu' ref='list'
          items={choices} onChange={this.select} />
      </div>}
    </div>
  }
}
