import React from 'react'

import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import './SelectorMatchedItem.scss'

const { func, string } = React.PropTypes

export default function SelectorMatchedItem ({ avatarUrl, id, name, deleteMatch }) {
  return <div styleName='selector-matched-item'>
    <RoundImage url={avatarUrl} small styleName='avatar' />
    <span styleName='name'>{name}</span>
    <span onClick={deleteMatch}>
      <Icon name='Ex' styleName='delete-match' />
    </span>
  </div>
}

SelectorMatchedItem.propTypes = {
  name: string,
  deleteMatch: func
}
