import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import { POST_TYPES } from 'store/models/Post'
import './CreateModal.scss'

const postTypes = Object.keys(POST_TYPES)
// For now, pulling description from /store/models/Post.js
// Next, edit POST_TYPES in CreateModal.connector and add group name to description text.

export default class CreateModalChooser extends Component {
  render () {
    const { location } = this.props
    const pathname = location.pathname.slice(-1) === '/' ? location.pathname : `${location.pathname}/`
    const params = location.search ? `&${location.search.substring(1)}` : ''
    const hasLocation = params.includes('lat') && params.includes('lng')

    return <div styleName='chooser'>
      <h1>{hasLocation ? 'New Post at this location: ' : ''}What would vou like to create?</h1>
      {postTypes.map(postType => {
        const postTypeUppercase = postType.charAt(0).toUpperCase() + postType.slice(1)
        const iconName = postType === 'request' ? 'Heart' : postTypeUppercase

        return <Link to={pathname + 'post?newPostType=' + postType + params} key={postType}>
          <div>
            <Icon name={iconName} styleName='postIcon' />
            <b>
              <span styleName='postTypeName'>{postType}</span>
              <span styleName='postTypeDescription'>{POST_TYPES[postType].description}</span>
            </b>
            <span styleName='indicator' />
          </div>
        </Link>
      })}
      <Link to={pathname + 'group' + params}>
        <div key='group'>
          <Icon name='Groups' styleName='postIcon' />
          <b>
            <span styleName='postTypeName'>Group</span>
            <span styleName='postTypeDescription'>Create a new movement, network, community or group!</span>
          </b>
          <span styleName='indicator' />
        </div>
      </Link>
    </div>
  }
}
