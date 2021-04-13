import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { postUrl } from 'util/navigation'
import RoundImage from '../../RoundImage'

import './ProjectsWidget.scss'

const { array, object } = PropTypes

export default class ProjectsWidget extends Component {
  static propTypes = {
    group: object,
    projects: array
  }

  render () {
    const { group, projects } = this.props
    // TODO: Can use the Projects component on MemberProfile?
    return (
      <div styleName='projects'>
        {projects && projects.map(p => <Link to={postUrl(p.id, { groupSlug: group.slug })}>
          <div styleName='project' key={p.id}>
            <div styleName='meta'>
              <div styleName='title'>{p.title}</div>
              <div styleName='last-activity'>{moment(p.updatedAt).fromNow()}</div>
            </div>
            <div styleName='created-by'>
              <RoundImage url={p.creator.avatarUrl} />
            </div>
          </div>
        </Link>)}
      </div>
    )
  }
}
