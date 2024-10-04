import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'
import RoundImage from 'components/RoundImage'
import classes from './PeopleListItem.module.scss'

export default function PeopleListItem ({ active, onClick, onMouseOver, person }) {
  return <li className={cx(classes.personListItem, { [classes.active]: active })} onClick={onClick} onMouseOver={onMouseOver}>
    <RoundImage url={person.avatarUrl} className={classes.avatar} medium />
    <div>
      <span className={classes.name}>{person.name}</span>
      <span className={classes.group}>{person.group}</span>
    </div>
  </li>
}

PeopleListItem.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  person: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    avatarUrl: PropTypes.string,
    group: PropTypes.string
  })
}
