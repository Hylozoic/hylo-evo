import PropTypes from 'prop-types'
import React, { Component } from 'react'
const { array } = PropTypes

import './GroupTopicsWidget.scss'

export default class GroupTopicsWidget extends Component {
  static propTypes = {
    topics: array
  }

  constructor () {
    super()
  }

  render () {
    const { topics } = this.props
    return (
      <div>
        {topics.map(t => <div>{t.postsTotal} {t.name}</div>)}
      </div>
    )
  }
}
