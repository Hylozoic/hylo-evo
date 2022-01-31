import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'
import RoundImage from 'components/RoundImage'
import './PeopleListItem.scss'

export default function PeopleListItem ({ active, onClick, onMouseOver, person }) {
  return <li styleName={cx('person-list-item', { active })} onClick={onClick} onMouseOver={onMouseOver}>
    <RoundImage url={person.avatarUrl} styleName='avatar' medium />
    <div>
      <span styleName='name'>{person.name}</span>
      <span styleName='group'>{person.group}</span>
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
