import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './GroupTopicsWidget.scss'

const { array } = PropTypes

export default class GroupTopicsWidget extends Component {
  static propTypes = {
    topics: array
  }

  render () {
    const { topics } = this.props
    return (
      <div styleName='group-topics'>
        {topics && topics.slice(0, 10).map(t => <Link key={t.id} to='#'>
          <div styleName='topic-wrapper'>
            <div styleName='topic-wrapper'>
              <div styleName='topic'>
                <span styleName='num-posts'>{t.postsTotal}</span>
                <span styleName='topic-name'>{t.name}</span>
              </div>
            </div>
          </div>
        </Link>)}
      </div>
    )
  }
}
