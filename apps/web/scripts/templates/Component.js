import PropTypes from 'prop-types'
import React from 'react'
import classes from './ReplaceComponent.module.scss'

const { string } = PropTypes

export default function ReplaceComponent ({ example }) {
  return <div className={classes.exampleName}>{example}</div>
}
ReplaceComponent.propTypes = {
  example: string
}
