import React from 'react'
import { Link } from 'react-router-dom'
import isWebView from 'util/webView'
import { POST_TYPES } from 'store/models/Post'
import Icon from 'components/Icon'
import './CreateModal.scss'
import { useTranslation } from 'react-i18next'

const postTypes = Object.keys(POST_TYPES).filter(t => t !== 'chat')

export default function CreateModalChooser ({ location }) {
  const querystringParams = new URLSearchParams(location.search)
  const hasLocation = querystringParams.has('lat') && querystringParams.has('lng')
  const { t } = useTranslation()
  // These need to be invoked here so that they get picked up by the translation extractor
  t('What help can you offer?')
  t('What are you looking for help with?')
  t('What resource is available?')
  t('What would you like to call your project?')
  t('What is your event called?')
  t('Add a title')
  t('Add a description')
  t('request')
  t('discussion')
  t('offer')
  t('resource')
  t('project')
  t('proposal')
  t('event')
  t('Talk about whats important with others')

  return (
    <div styleName='chooser'>
      <h1>{hasLocation && t('New Post at this location:') + ' '}{t('What would you like to create?')}</h1>
      {postTypes.map(postType => {
        querystringParams.set('newPostType', postType)

        const createPostForPostTypePath = `${location.pathname}/post?${querystringParams.toString()}`
        const postTypeUppercase = postType.charAt(0).toUpperCase() + postType.slice(1)
        let iconName = postTypeUppercase
        if (postType === 'request') iconName = 'Heart'
        if (postType === 'proposal') iconName = 'Handshake'

        return (
          <Link to={createPostForPostTypePath} key={postType}>
            <div>
              <Icon name={iconName} styleName='postIcon' />
              <b>
                <span styleName='postTypeName'>{t(postType)}</span>
                <span styleName='postTypeDescription'>{t(POST_TYPES[postType].description)}</span>
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
              <span styleName='postTypeName'>{t('Group')}</span>
              <span styleName='postTypeDescription'>{t('Create a new movement, network, community or group!')}</span>
            </b>
            <span styleName='indicator' />
          </div>
        </Link>
      )}
    </div>
  )
}
