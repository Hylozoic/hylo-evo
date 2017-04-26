import React from 'react'
import './PeopleSelector.scss'

const { any, arrayOf, func, string } = React.PropTypes

const personType = {
  id: any,
  name: string
}

export default class PeopleSelector extends React.Component {
  static propTypes = {
    fetchPeople: func,
    matches: arrayOf(personType),
    setAutocomplete: func
  }

  render () {
    const { matches } = this.props
    return <div>{matches && matches.map(match => 
      match.name
    )}</div>
  }
}
