import React from 'react'
import { debounce, throttle } from 'lodash/fp'

import { getKeyCode, keyMap } from 'util/textInput'
import SelectorMatchedItem from 'components/SelectorMatchedItem'
import './PeopleSelector.scss'

const { any, arrayOf, func, shape, string } = React.PropTypes

const personType = shape({
  id: any,
  name: string
})

// TODO: This _grossly_ underestimates the problem! See:
// https://www.w3.org/International/questions/qa-personal-names
const invalidPersonName = /[^a-z'-]+/gi

export default class PeopleSelector extends React.Component {
  static propTypes = {
    fetchPeople: func,
    deleteMatch: func,
    matches: arrayOf(personType),
    setAutocomplete: func
  }

  autocompleteSearch = throttle(1000, this.props.fetchPeople)

  onChange = debounce(200, evt => {
    const { value } = this.autocomplete
    if (!invalidPersonName.exec(value)) {
      return this.props.setAutocomplete(value)
    }
    evt.target.value = value.replace(invalidPersonName, '')
  })

  onKeyDown (evt) {
    const keyCode = getKeyCode(evt)
    if (keyCode !== keyMap.BACKSPACE) {
      this.autocompleteSearch(this.autocomplete.value)
    }
    if (keyCode === keyMap.COMMA || keyCode === keyMap.ENTER) {
      evt.preventDefault()
      this.autocomplete.value = null
      return this.props.setAutocomplete(null)
    }
  }

  render () {
    const { deleteMatch, matches } = this.props
    return <div>
      {matches && matches.map(match =>
        <SelectorMatchedItem
          key={match.id}
          name={match.name}
          deleteMatch={() => deleteMatch(match.id)} />
      )}
      <input
        ref={i => this.autocomplete = i} // eslint-disable-line no-return-assign
        type='text'
        spellCheck={false}
        onChange={evt => this.onChange(evt)}
        onKeyDown={evt => this.onKeyDown(evt)} />
    </div>
  }
}
