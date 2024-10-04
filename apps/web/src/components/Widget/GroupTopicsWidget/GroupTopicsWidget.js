import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { topicUrl } from 'util/navigation'

import classes from './GroupTopicsWidget.module.scss'

const { array, object } = PropTypes

export default class GroupTopicsWidget extends Component {
  static propTypes = {
    items: array,
    group: object
  }

  render () {
    const { group, items } = this.props

    return (
      <div className={classes.groupTopics}>
        {items && items.map(t => <Link key={t.id} to={topicUrl(t.name, { groupSlug: group.slug, context: 'groups' })}>
          <div className={classes.topicWrapper}>
            <div className={classes.topicWrapper}>
              <div className={classes.topic}>
                <span className={classes.numPosts}>{t.postsTotal}</span>
                <span className={classes.topicName}>{t.name}</span>
              </div>
            </div>
          </div>
        </Link>)}
      </div>
    )
  }
}
