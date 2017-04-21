import React from 'react'
import './ReplaceComponent.scss'

const { string } = React.PropTypes

export default function ReplaceComponent ({ example }) {
  return <div styleName='exampleName'>{example}</div>
}
ReplaceComponent.propTypes = {
  example: string
}
