import React from 'react'
import './NewMessageThread.scss'

const { string } = React.PropTypes

export default function NewMessageThread ({ example }) {
  return <div styleName='exampleName'>{example}</div>
}
NewMessageThread.propTypes = {
  example: string
}
