import React from 'react'
import { Link } from 'react-router-dom'
import isWebView from 'util/webView'
import { POST_TYPES } from 'store/models/Post'
import Icon from 'components/Icon'
import classes from './CreateModal.module.scss'
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
    <div className={classes.chooser}>
      <h1>{hasLocation && t('New Post at this location:') + ' '}{t('What would you like to create?')}</h1>
      {postTypes.map(postType => {
        querystringParams.set('newPostType', postType)

        const createPostForPostTypePath = `${location.pathname}/post?${querystringParams.toString()}`
        const postTypeUppercase = postType.charAt(0).toUpperCase() + postType.slice(1)
        const iconName = postType === 'request' ? 'Heart' : postTypeUppercase

        return (
          <Link to={createPostForPostTypePath} key={postType}>
            <div>
              <Icon name={iconName} className={classes.postIcon} />
              <b>
                <span className={classes.postTypeName}>{t(postType)}</span>
                <span className={classes.postTypeDescription}>{t(POST_TYPES[postType].description)}</span>
              </b>
              <span className={classes.indicator} />
            </div>
          </Link>
        )
      })}
      {/* Creating a Group by location is not currently supported in HyloApp */}
      {!isWebView() && (
        <Link to={`${location.pathname}/group`}>
          <div key='group'>
            <Icon name='Groups' className={classes.postIcon} />
            <b>
              <span className={classes.postTypeName}>{t('Group')}</span>
              <span className={classes.postTypeDescription}>{t('Create a new movement, network, community or group!')}</span>
            </b>
            <span className={classes.indicator} />
          </div>
        </Link>
      )}
    </div>
  )
}
