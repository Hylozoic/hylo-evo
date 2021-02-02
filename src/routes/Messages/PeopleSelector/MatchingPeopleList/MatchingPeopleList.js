import PropTypes from 'prop-types'
import React from 'react'
import PeopleListItem from '../PeopleListItem'
import './MatchingPeopleList.scss'

export default class MatchingPeopleList extends React.Component {
  render () {
    const { onClick, currentMatch, matchingPeople, onMouseOver } = this.props
    return <ul styleName='people-selector-matches'>
      {matchingPeople && matchingPeople.map(match =>
        <PeopleListItem
          key={match.id}
          active={match.id === currentMatch.id}
          person={match}
          onClick={() => onClick(match)}
          onMouseOver={() => onMouseOver(match)} />)}
    </ul>
  }
}

MatchingPeopleList.propTypes = {
  onClick: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  currentMatch: PropTypes.object,
  matchingPeople: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any,
      name: PropTypes.string,
      avatarUrl: PropTypes.string,
      group: PropTypes.string
    })
  )
}
