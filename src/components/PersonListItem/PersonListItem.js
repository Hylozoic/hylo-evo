import React from 'react'
import cx from 'classnames'

import './PersonListItem.scss'

const { any, bool, func, shape, string } = React.PropTypes

const personType = shape({
  active: bool,
  id: any,
  name: string,
  avatarUrl: string,
  community: string
})

export default function PersonListItem ({ addMatch, person }) {
  return <li styleName={cx('person-list-item', { active: person.active })}>{person.name}</li>
}

PersonListItem.propTypes = {
  addMatch: func,
  person: personType
}
