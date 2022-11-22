import React from 'react'
import { Link } from 'react-router-dom'
import isWebView from 'util/webView'
import { POST_TYPES } from 'store/models/Post'
import Icon from 'components/Icon'
import './CreateModal.scss'
import { useTranslation } from 'react-i18next'

const postTypes = Object.keys(POST_TYPES)

export default function CreateModalChooser ({ location }) {
  const querystringParams = new URLSearchParams(location.search)
  const hasLocation = querystringParams.has('lat') && querystringParams.has('lng')
  const { t } = useTranslation()

  return (
    <div styleName='chooser'>
      <h1>{hasLocation && t('CreateModalChooser.newPostAtLocationTitle')}{t('CreateModalChooser.createQuestion')}</h1>
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
              <span styleName='postTypeName'>{t('CreateModalChooser.group')}</span>
              <span styleName='postTypeDescription'>{t('CreateModalChooser.createSomething')}</span>
            </b>
            <span styleName='indicator' />
          </div>
        </Link>
      )}
    </div>
  )
}
