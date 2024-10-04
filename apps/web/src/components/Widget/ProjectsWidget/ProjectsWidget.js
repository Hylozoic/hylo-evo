import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { postUrl, createPostUrl } from 'util/navigation'
import RoundImage from '../../RoundImage'

import classes from './ProjectsWidget.module.scss'

const { array, bool, object } = PropTypes

class ProjectsWidget extends Component {
  static propTypes = {
    isMember: bool,
    items: array,
    routeParams: object
  }

  render () {
    const { isMember, items, routeParams, t } = this.props

    return (
      <div className={classes.projects}>
        {items && items.map(p => (
          <Link to={postUrl(p.id, routeParams)} key={p.id}>
            <div className={classes.project}>
              <div className={classes.meta}>
                <div className={classes.title}>{p.title}</div>
                <div className={classes.lastActivity}>{moment(p.updatedAt).fromNow()}</div>
              </div>
              <div className={classes.createdBy}>
                <RoundImage url={p.creator.avatarUrl} />
              </div>
            </div>
          </Link>
        ))}
        {items.length < 3 && isMember ? (
          <Link to={createPostUrl(routeParams, { newPostType: 'project' })} className={classes.newProject}>
            <div className={classes.project}>
              <div className={classes.meta}>
                <div>
                  <div className={classes.title}>{t('What are you doing together?')}</div>
                  <div className={classes.lastActivity}>{t('Projects help you and your group accomplish shared goals.')}</div>
                </div>
                <div className={classes.createProjectCta}>{t('+ New project')}</div>
              </div>
            </div>
          </Link>
        ) : (
          ''
        )}
      </div>
    )
  }
}

export default withTranslation()(ProjectsWidget)
