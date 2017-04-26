import React from 'react'

import './SelectorMatchedItem.scss'

const { func, string } = React.PropTypes

export default function SelectorMatchedItem ({ name, deleteMatch }) {
  return <div styleName='selector-matched-item'>{name}</div>
}

SelectorMatchedItem.propTypes = {
  name: string,
  deleteMatch: func
}
