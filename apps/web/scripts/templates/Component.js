import PropTypes from 'prop-types'
import React from 'react'
import './ReplaceComponent.scss'

const { string } = PropTypes

export default function ReplaceComponent ({ example }) {
  return <div styleName='exampleName'>{example}</div>
}
ReplaceComponent.propTypes = {
  example: string
}
