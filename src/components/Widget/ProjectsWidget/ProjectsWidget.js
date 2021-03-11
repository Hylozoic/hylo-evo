import PropTypes from 'prop-types'
import React, { Component } from 'react'
const { array } = PropTypes

import './ProjectsWidget.scss'

export default class ProjectsWidget extends Component {
  static propTypes = {
    projects: array
  }

  constructor () {
    super()
  }

  render () {
    const { projects, routeParams, showDetails } = this.props
    // Can use the Projects component on MemberProfile
    return (
      <div>
        {projects.map(p => <div>{p.title}</div>)}
      </div>
    )
  }
}
