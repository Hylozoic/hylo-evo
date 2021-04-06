import PropTypes from 'prop-types'
import React, { Component } from 'react'

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
      <div>
        {projects && projects.map(p => <div key={p.id}>{p.title}</div>)}
      </div>
    )
  }
}
