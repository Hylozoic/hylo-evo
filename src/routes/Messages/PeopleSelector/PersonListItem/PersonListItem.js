import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'

import RoundImage from 'components/RoundImage'
import './PersonListItem.scss'

export default function PersonListItem ({ active, onClick, onMouseOver, person }) {
  return <li styleName={cx('person-list-item', { active })} onClick={onClick} onMouseOver={onMouseOver}>
    <RoundImage url={person.avatarUrl} styleName='avatar' medium />
    <span styleName='name'>{person.name}</span>
    <span styleName='community'>{person.community}</span>
  </li>
}

const personType = PropTypes.shape({
  id: PropTypes.any,
  name: PropTypes.string,
  avatarUrl: PropTypes.string,
  community: PropTypes.string
})

PersonListItem.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  person: personType
}
