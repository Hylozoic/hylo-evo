import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { POST_TYPES } from 'store/models/Post'
import './CreateModal.scss'

export default class CreateModalChooser extends Component {
  render () {
    const { location } = this.props

    return <div>
      {Object.keys(POST_TYPES).map(postType =>
        <div>
          <Link to={location.pathname + postType}>{postType}</Link>
        </div>
      )}
      <div>
        <Link to={location.pathname + 'Group'}>Group</Link>
      </div>
    </div>
  }
}
