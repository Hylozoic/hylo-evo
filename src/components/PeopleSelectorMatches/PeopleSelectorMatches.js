import React from 'react'

import PersonListItem from 'components/PersonListItem'
import './PeopleSelectorMatches.scss'

const { any, arrayOf, func, shape, string } = React.PropTypes

const personType = shape({
  id: any,
  name: string,
  avatarUrl: string,
  community: string
})

export default class PeopleSelectorMatches extends React.Component {
  static propTypes = {
    addMatch: func,
    currentMatch: any,
    matches: arrayOf(personType)
  }

  render () {
    const { matches } = this.props
    return <ul styleName='people-selector-matches'>
      {matches && matches.map(match => <PersonListItem key={match.id} person={match} />)}
    </ul>
  }
}
