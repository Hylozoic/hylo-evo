import PropTypes from 'prop-types'
import React from 'react'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import classes from './MatchingPeopleListItem.module.scss'

export default function MatchingPeopleListItem ({ avatarUrl, name, onClick }) {
  return <div className={cx(classes.selectorMatchedItem)}>
    <RoundImage url={avatarUrl} small className={cx(classes.avatar)} />
    <span className={cx(classes.name)}>{name}</span>
    <span onClick={onClick}>
      <Icon name='Ex' className={cx(classes.deleteMatch)} />
    </span>
  </div>
}

MatchingPeopleListItem.propTypes = {
  avatarUrl: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func
}
