import PropTypes from 'prop-types'
import React, { Component } from 'react'
import RoundImage from '../../RoundImage'

import './ProjectsWidget.scss'

const { array } = PropTypes

export default class ProjectsWidget extends Component {
  static propTypes = {
    projects: array
  }

  render () {
    const { projects } = this.props
    // TODO: Can use the Projects component on MemberProfile
    return (
      <div styleName='projects'>
        {projects && projects.map(p => <div styleName='project' key={p.id}>
          <div styleName='meta'>
            <div styleName='title'>{p.title}</div>
            <div styleName='last-activity'>{p.lastActivity}</div>
          </div>
          <div styleName='created-by'>
            <RoundImage url={p.createdBy} />
          </div>
        </div>)}
      </div>
    )
  }
}
