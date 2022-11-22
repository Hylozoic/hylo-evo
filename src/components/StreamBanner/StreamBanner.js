import React from 'react'
import ReactTooltip from 'react-tooltip'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { bgImageStyle } from 'util/index'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Group'
import PostLabel from 'components/PostLabel'
import './StreamBanner.scss'
import { whiteMerkaba, allGroupsBanner, publicGlobe } from 'util/assets'
import Icon from 'components/Icon'
import PostPrompt from './PostPrompt'

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
  const { t } = useTranslation()
  let bannerUrl, avatarUrl, name, location, subtitle

  if (context === 'all') {
    name = t('StreamBanner.allMyGroupsTitle')
    avatarUrl = whiteMerkaba
    bannerUrl = allGroupsBanner
    subtitle = currentUser && t('StreamBanner.groupsSubtitle', { count: currentUser.memberships.count() })
  } else if (context === 'public') {
    name = t('StreamBanner.publicGroupsAndPostTitle')
    avatarUrl = publicGlobe
    bannerUrl = allGroupsBanner
    // TODO list count of public posts and public groups in subtitle
    subtitle = t('StreamBanner.allPostsMarkedPublicSubtitle')
  } else if (!group) {
    return null
  } else {
    ({ bannerUrl, avatarUrl, name, location } = group)
  }

  let numCustomFilters = customViewType === 'stream' ? (customPostTypes.length + customViewTopics.length + (customActivePostsOnly ? 1 : 0)) : false
  const customActivePostsStatus = customActivePostsOnly ? t('StreamBanner.active') : ''

  return <div styleName={cx('banner', { 'all-groups': context === 'all' })}>
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
              ? <div styleName='num-filters' data-tip='' data-for='feed-banner-tip'>{t('StreamBanner.numberOfFilters', { numCustomFilters })}</div>
              : customViewType === 'collection'
                ? <div styleName='num-filters' data-tip='' data-for='feed-banner-tip'>{t('StreamBanner.collection')}</div>
                : ''}

            {subtitle && <div styleName='header-subtitle'>
              {subtitle}
            </div>}
          </div>
        </div>
      </div>
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
              t('StreamBanner.displayingActivePostsStatus', { customActivePostsStatus })
            </span>

            {customPostTypes.length === 0 ? 'None' : customPostTypes.map((p, i) => <span key={i} styleName='post-typelabel'><PostLabel key={p} type={p} styleName='post-type' />{p}s +</span>)}
            {customViewTopics.length > 0 && <div styleName='filtered-topics'>t('StreamBanner.filteredByTopics')</div>}
            {customViewTopics.length > 0 && customViewTopics.map(topic => <span key={topic.id} styleName='filtered-topic'>#{topic.name}</span>)}
          </div>
          : ''
        )
      }}
    />}
  </div>
}
