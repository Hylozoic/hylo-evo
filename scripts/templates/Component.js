import React from 'react'
import './ReplaceComponent.scss'

const { string } = React.PropTypes

export default function ReplaceComponent ({ exampleProp }) {
  return <div styleName='exampleName'>{exampleProp}</div>
}
ReplaceComponent.propTypes = {
  exampleProp: string
}
