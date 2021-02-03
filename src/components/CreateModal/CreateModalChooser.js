import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import { POST_TYPES } from 'store/models/Post'
import './CreateModal.scss'

const postTypes = Object.keys(POST_TYPES);
// For now, pulling description from /store/models/Post.js
// Next, edit POST_TYPES in CreateModal.connector and add group name to description text.

export default class CreateModalChooser extends Component {
  render () {
    const { location } = this.props

    return <div styleName='chooser'>
      <h1>What would you like to create?</h1>
      {postTypes.map(postType => {
        const postTypeUppercase = postType.charAt(0).toUpperCase() + postType.slice(1)
        const iconName = postType === 'request' ? 'Heart' : postTypeUppercase

        return <Link to={location.pathname + 'post?t=' + postType}>
          <div key={postType}> 
            <Icon name={iconName} styleName='postIcon'/>
            <b>
              <span styleName='postTypeName'>{postType}</span>
              <span styleName='postTypeDescription'>{POST_TYPES[postType].description}</span>
            </b>
            <span styleName='indicator'></span>
          </div>
        </Link>
        }
      )}
      <Link to={location.pathname + 'group'}>
        <div key='group'>
          <Icon name='Groups' styleName='postIcon'/>
          <b>
            <span styleName='postTypeName'>Group</span>
            <span styleName='postTypeDescription'>Create a new movement, network, community or group!</span>
          </b>
          <span styleName='indicator'></span>
        </div>
      </Link>
    </div>
  }
}
