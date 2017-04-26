import React from 'react'

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

  render () {
    const { matches } = this.props
    return <div>{matches && matches.map(match => 
      <SelectorMatchedItem
        key={match.id}
        name={match.name}
        deleteMatch={() => deleteMatch(match.id)} />
    )}</div>
  }
}
