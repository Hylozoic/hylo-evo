import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classes from './ReplaceComponent.module.scss'

const { string } = PropTypes

export default class ReplaceComponent extends Component {
  static propTypes = {
    example: string
  }

  render () {
    const { example } = this.props
    return <div className={classes.exampleName}>{example}</div>
  }
}
