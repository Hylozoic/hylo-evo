import { DateTime } from 'luxon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { postUrl, createPostUrl } from 'util/navigation'
import RoundImage from '../../RoundImage'

import './ProjectsWidget.scss'

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
      <div styleName='projects'>
        {items && items.map(p => <Link to={postUrl(p.id, routeParams)} key={p.id}>
          <div styleName='project'>
            <div styleName='meta'>
              <div styleName='title'>{p.title}</div>
              <div styleName='last-activity'>{DateTime.fromISO(p.updatedAt).toRelative()}</div>
            </div>
            <div styleName='created-by'>
              <RoundImage url={p.creator.avatarUrl} />
            </div>
          </div>
        </Link>)}
        {items.length < 3 && isMember ? <Link to={createPostUrl(routeParams, { newPostType: 'project' })} styleName='new-project'>
          <div styleName='project'>
            <div styleName='meta'>
              <div>
                <div styleName='title'>{t('What are you doing together?')}</div>
                <div styleName='last-activity'>{t('Projects help you and your group accomplish shared goals.')}</div>
              </div>
              <div styleName='create-project-cta'>{t('+ New project')}</div>
            </div>
          </div>
        </Link> : '' }
      </div>
    )
  }
}
export default withTranslation()(ProjectsWidget)
