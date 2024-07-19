import PropTypes from 'prop-types'
import React from 'react'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import './MatchingPeopleListItem.scss'

export default function MatchingPeopleListItem ({ avatarUrl, name, onClick }) {
  return <div styleName='selector-matched-item'>
    <RoundImage url={avatarUrl} small styleName='avatar' />
    <span styleName='name'>{name}</span>
    <span onClick={onClick}>
      <Icon name='Ex' styleName='delete-match' />
    </span>
  </div>
}

MatchingPeopleListItem.propTypes = {
  avatarUrl: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func
}
