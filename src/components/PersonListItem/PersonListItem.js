import React from 'react'
import cx from 'classnames'

import RoundImage from 'components/RoundImage'
import './PersonListItem.scss'

const { any, bool, func, shape, string } = React.PropTypes

const personType = shape({
  id: any,
  name: string,
  avatarUrl: string,
  community: string
})

export default function PersonListItem ({ addParticipant, active, person }) {
  return <li styleName={cx('person-list-item', { active })}>
    <RoundImage url={person.avatarUrl} styleName='avatar' />
    <span styleName='name'>{person.name}</span>
    <span styleName='community'>{person.community}</span>
  </li>
}

PersonListItem.propTypes = {
  active: bool,
  addParticipant: func,
  person: personType
}
