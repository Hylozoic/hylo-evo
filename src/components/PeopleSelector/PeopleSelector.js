import React from 'react'
import { debounce } from 'lodash/fp'

import { getKeyCode, keyMap } from 'util/textInput'
import SelectorMatchedItem from 'components/SelectorMatchedItem'
import './PeopleSelector.scss'

const { any, arrayOf, func, shape, string } = React.PropTypes

const personType = shape({
  id: any,
  name: string
})

export default class PeopleSelector extends React.Component {
  static propTypes = {
    fetchPeople: func,
    deleteMatch: func,
    matches: arrayOf(personType),
    setAutocomplete: func
  }

  handleChange (val) {
    this.props.setAutocomplete(val)
  }

  handleKeys (evt) {
    const keyCode = getKeyCode(evt)
    console.log(keyCode)
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
        ref={i => this.input = i} // eslint-disable-line no-return-assign
        type='text'
        spellCheck={false}
        onChange={evt => this.handleChange(evt.target.value)}
        onKeyDown={evt => this.handleKeys(evt)} />
    </div>
  }
}
