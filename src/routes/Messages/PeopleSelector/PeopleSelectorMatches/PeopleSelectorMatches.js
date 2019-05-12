import PropTypes from 'prop-types'
import React from 'react'
import PersonListItem from '../PersonListItem'
import './PeopleSelectorMatches.scss'

export default class PeopleSelectorMatches extends React.Component {
  render () {
    const { addParticipant, currentMatch, matches, setCurrentMatch } = this.props
    return <ul styleName='people-selector-matches'>
      {matches && matches.map(match =>
        <PersonListItem
          key={match.id}
          active={match.id === currentMatch.id}
          person={match}
          onClick={() => addParticipant(match)}
          onMouseOver={() => setCurrentMatch(match)} />)}
    </ul>
  }
}

PeopleSelectorMatches.propTypes = {
  addParticipant: PropTypes.func.isRequired,
  setCurrentMatch: PropTypes.func.isRequired,
  currentMatch: PropTypes.object,
  matches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any,
      name: PropTypes.string,
      avatarUrl: PropTypes.string,
      community: PropTypes.string
    })
  )
}
