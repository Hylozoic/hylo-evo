import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './GroupTopicsWidget.scss'

const { array } = PropTypes

export default class GroupTopicsWidget extends Component {
  static propTypes = {
    topics: array
  }

  render () {
    const { topics } = this.props
    return (
      <div>
        {topics && topics.map(t => <div key={t.id}>{t.postsTotal} {t.name}</div>)}
      </div>
    )
  }
}
