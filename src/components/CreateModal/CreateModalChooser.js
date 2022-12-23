import React from 'react'
import { Link } from 'react-router-dom'
import isWebView from 'util/webView'
import { POST_TYPES } from 'store/models/Post'
import Icon from 'components/Icon'
import './CreateModal.scss'

const postTypes = Object.keys(POST_TYPES).filter(t => t !== 'chat')

export default function CreateModalChooser ({ location }) {
  const querystringParams = new URLSearchParams(location.search)
  const hasLocation = querystringParams.has('lat') && querystringParams.has('lng')

  return (
    <div styleName='chooser'>
      <h1>{hasLocation && 'New Post at this location: '}What would you like to create?</h1>
      {postTypes.map(postType => {
        querystringParams.set('newPostType', postType)

        const createPostForPostTypePath = `${location.pathname}/post?${querystringParams.toString()}`
        const postTypeUppercase = postType.charAt(0).toUpperCase() + postType.slice(1)
        const iconName = postType === 'request' ? 'Heart' : postTypeUppercase

        return (
          <Link to={createPostForPostTypePath} key={postType}>
            <div>
              <Icon name={iconName} styleName='postIcon' />
              <b>
                <span styleName='postTypeName'>{postType}</span>
                <span styleName='postTypeDescription'>{POST_TYPES[postType].description}</span>
              </b>
              <span styleName='indicator' />
            </div>
          </Link>
        )
      })}
      {/* Creating a Group by location is not currently supported in HyloApp */}
      {!isWebView() && (
        <Link to={`${location.pathname}/group`}>
          <div key='group'>
            <Icon name='Groups' styleName='postIcon' />
            <b>
              <span styleName='postTypeName'>Group</span>
              <span styleName='postTypeDescription'>Create a new movement, network, community or group!</span>
            </b>
            <span styleName='indicator' />
          </div>
        </Link>
      )}
    </div>
  )
}
