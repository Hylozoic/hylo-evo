import React from 'react'
import './PersonListItem.scss'

const { string } = React.PropTypes

export default function PersonListItem ({ example }) {
  return <div styleName='exampleName'>{example}</div>
}
PersonListItem.propTypes = {
  example: string
}
