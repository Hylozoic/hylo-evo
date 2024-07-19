import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { topicUrl } from 'util/navigation'

import './GroupTopicsWidget.scss'

const { array, object } = PropTypes

export default class GroupTopicsWidget extends Component {
  static propTypes = {
    items: array,
    group: object
  }

  render () {
    const { group, items } = this.props

    return (
      <div styleName='group-topics'>
        {items && items.map(t => <Link key={t.id} to={topicUrl(t.name, { groupSlug: group.slug, context: 'groups' })}>
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
