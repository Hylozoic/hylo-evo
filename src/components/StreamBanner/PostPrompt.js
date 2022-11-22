import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import cx from 'classnames'

import { createPostUrl } from 'util/navigation'
import RoundImage from 'components/RoundImage'

const PostPrompt = ({ avatarUrl, className, firstName = '', querystringParams = {}, routeParams = {}, type = '' }) => {
  const [hover, setHover] = useState('')
  const { t } = useTranslation()

  const postPromptString = (type, firstName) => {
    const greeting = t('StreamBanner.greeting', { firstName })
    const postPrompts = {
      offer: `${greeting}, ${t('StreamBanner.offer')}`,
      request: `${greeting}, ${t('StreamBanner.request')}`,
      project: `${greeting}, ${t('StreamBanner.project')}`,
      event: `${greeting}, ${t('StreamBanner.event')}`,
      default: `${greeting}, ${t('StreamBanner.default')}`
    }

    return postPrompts[type] || postPrompts['default']
  }

  return (<div onMouseEnter={setHover(true)} onMouseLeave={setHover(false)}>
    <Link to={createPostUrl(routeParams, { ...querystringParams, newPostType: type })}>
      <div styleName='postPrompt' className={className}>
        <RoundImage url={avatarUrl} small styleName='prompt-image' />
        {postPromptString(type, firstName)}
      </div>
    </Link>
    <div styleName={cx('shadow', { hover })} />
  </div>)
}

export default PostPrompt
