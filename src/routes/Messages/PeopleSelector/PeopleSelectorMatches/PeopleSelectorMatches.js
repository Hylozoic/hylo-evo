import PropTypes from 'prop-types'
import React from 'react'

import PersonListItem from '../PersonListItem'
import './PeopleSelectorMatches.scss'

const { any, arrayOf, func, shape, string } = PropTypes

const personType = shape({
  id: any,
  name: string,
  avatarUrl: string,
  community: string
})

export default class PeopleSelectorMatches extends React.Component {
  static propTypes = {
    addParticipant: func,
    currentMatch: any,
    matches: arrayOf(personType)
  }

  render () {
    const { addParticipant, currentMatch, matches, setCurrentMatch } = this.props
    return <ul styleName='people-selector-matches'>
      {matches && matches.map(match =>
        <PersonListItem
          key={match.id}
          active={match.id === currentMatch}
          person={match}
          onClick={() => addParticipant(match)}
          onMouseOver={() => setCurrentMatch(match)} />)}
    </ul>
  }
}
