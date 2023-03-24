import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactTooltip from 'react-tooltip'
import cx from 'classnames'
import { capitalize } from 'lodash'
import { Link } from 'react-router-dom'
import { bgImageStyle } from 'util/index'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Group'
import PostLabel from 'components/PostLabel'
import './StreamBanner.scss'
import { whiteMerkaba, allGroupsBanner, publicGlobe } from 'util/assets'
import { createPostUrl } from 'util/navigation'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { CONTEXT_MY } from 'store/constants'

export default function StreamBanner ({
  context,
  currentUserHasMemberships,
  currentUser,
  customActivePostsOnly,
  customPostTypes,
  customViewTopics,
  customViewType,
  label,
  icon,
  group,
  newPost,
  querystringParams,
  routeParams,
  isTesting,
  type
}) {
  let bannerUrl, avatarUrl, name, location, subtitle
  const { t } = useTranslation()
  const view = routeParams.view
  
  if (context === 'all') {
    name = t('All My Groups')
    avatarUrl = whiteMerkaba
    bannerUrl = allGroupsBanner
    subtitle = currentUser && t('{{count}} Groups', { count: currentUser.memberships.count() })
  } else if (context === 'public') {
    name = t('Public Groups & Posts')
    avatarUrl = publicGlobe
    bannerUrl = allGroupsBanner
    // TODO list count of public posts and public groups in subtitle
    subtitle = t('All Posts Marked Public')
  } else if (context === 'my') {
    name = `${t('My Home')}: ${capitalize(t(view))}`
    avatarUrl = currentUser.avatarUrl || publicGlobe
    bannerUrl = currentUser.bannerUrl || allGroupsBanner
    // These need to be invoked here so that they get picked up by the translation extractor
    t('Posts')
    t('Interactions')
    t('Mentions')
    t('Announcements')
  } else if (!group) {
    return null
  } else {
    ({ bannerUrl, avatarUrl, name, location } = group)
  }

  const numCustomFilters = customViewType === 'stream' ? (customPostTypes.length + customViewTopics.length + (customActivePostsOnly ? 1 : 0)) : false

  return (
    <div styleName={cx('banner', { 'all-groups': context === 'all' })}>
      <div style={bgImageStyle(bannerUrl || DEFAULT_BANNER)} styleName='image'>
        <div styleName='fade'><div styleName='fade2' /></div>
        <div styleName='header'>
          {icon
            ? <div styleName='custom-icon'>
              <Icon name={icon} />
            </div>
            : <div styleName={cx('logo', { 'all-logo': context === 'all' })} style={bgImageStyle(avatarUrl || DEFAULT_AVATAR)} /> }
          <div styleName='header-text'>
            <div styleName='header-contents'>
              <span styleName='header-name'>{label || name}</span>

              {location && !icon && <div styleName='header-subtitle'>
                <Icon name='Location' styleName='header-icon' />
                {location}
              </div>}

              {customViewType === 'stream'
                ? <div styleName='num-filters' data-tip='' data-for='feed-banner-tip'>{numCustomFilters} {t('Filters')}</div>
                : customViewType === 'collection'
                  ? <div styleName='num-filters' data-tip='' data-for='feed-banner-tip'>{t('Collection')}</div>
                  : ''}

              {subtitle && <div styleName='header-subtitle'>
                {subtitle}
              </div>}
            </div>
          </div>
        </div>
        {currentUserHasMemberships && context !== CONTEXT_MY && (<PostPrompt
          avatarUrl={currentUser.avatarUrl}
          firstName={currentUser.firstName()}
          newPost={newPost}
          querystringParams={querystringParams}
          routeParams={routeParams}
          type={type}
        />)}

        {/* The ReactTooltip with getContent breaks our snapshots because it uses dynamic classname, so removing in our tests */}
        {!isTesting && (<ReactTooltip
          id='feed-banner-tip'
          backgroundColor='rgba(35, 65, 91, 1.0)'
          effect='solid'
          delayShow={0}
          place='bottom'
          getContent={function () {
            return (customViewType === 'stream'
              ? <div styleName='custom-filters'>
                <span styleName='displaying'>
                  Displaying &nbsp;
                  {customActivePostsOnly ? 'active' : ''}
                </span>

                {customPostTypes.length === 0 ? 'None' : customPostTypes.map((p, i) => <span key={i} styleName='post-typelabel'><PostLabel key={p} type={p} styleName='post-type' />{p}s +</span>)}
                {customViewTopics.length > 0 && <div styleName='filtered-topics'>filtered by topics:</div>}
                {customViewTopics.length > 0 && customViewTopics.map(t => <span key={t.id} styleName='filtered-topic'>#{t.name}</span>)}
              </div>
              : ''
            )
          }}
        />)}
      </div>
      {currentUserHasMemberships && <PostPrompt
        avatarUrl={currentUser.avatarUrl}
        firstName={currentUser.firstName()}
        newPost={newPost}
        querystringParams={querystringParams}
        routeParams={routeParams}
        type={type}
      />}

      {/* The ReactTooltip with getContent breaks our snapshots because it uses dynamic classname, so removing in our tests */}
      {!isTesting && <ReactTooltip
        id='feed-banner-tip'
        backgroundColor='rgba(35, 65, 91, 1.0)'
        effect='solid'
        delayShow={0}
        place='bottom'
        getContent={function () {
          return (customViewType === 'stream'
            ? <div styleName='custom-filters'>
              <span styleName='displaying'>
                {t('Displaying') + ' '};
                {customActivePostsOnly ? 'active' : ''}
              </span>

              {customPostTypes.length === 0 ? t('None') : customPostTypes.map((p, i) => <span key={i} styleName='post-typelabel'><PostLabel key={p} type={p} styleName='post-type' />{p}s +</span>)}
              {customViewTopics.length > 0 && <div styleName='filtered-topics'>{t('filtered by topics:')}</div>}
              {customViewTopics.length > 0 && customViewTopics.map(t => <span key={t.id} styleName='filtered-topic'>#{t.name}</span>)}
            </div>
            : ''
          )
        }}
      />}
    </div>
  )
}

export const PostPrompt = (props) => {
  const { avatarUrl, className = 'post-prompt', firstName = '', type = '', querystringParams = {}, routeParams = {} } = props
  const [hover, setHover] = useState(false)
  const { t } = useTranslation()

  const postPromptString = (type, firstName) => {
    const postPrompts = {
      offer: t('Hi {{firstName}}, what would you like to share?', { firstName }),
      request: t('Hi {{firstName}}, what are you looking for?', { firstName }),
      project: t('Hi {{firstName}}, what would you like to create?', { firstName }),
      event: t('Hi {{firstName}}, want to create an event?', { firstName }),
      default: t('Hi {{firstName}}, what\'s on your mind?', { firstName })
    }
    return postPrompts[type] || postPrompts.default
  }

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Link to={createPostUrl(routeParams, { ...querystringParams, newPostType: type })}>
        <div styleName='postPrompt' className={className}>
          <RoundImage url={avatarUrl} small styleName='prompt-image' />
          {postPromptString(type, firstName)}
        </div>
      </Link>
      <div styleName={cx('shadow', { hover })} />
    </div>
  )
}
