import React from 'react'
import ReactTooltip from 'react-tooltip'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { bgImageStyle } from 'util/index'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Group'
import PostLabel from 'components/PostLabel'
import './FeedBanner.scss'
import { whiteMerkaba, allGroupsBanner, publicGlobe } from 'util/assets'
import { createPostUrl } from 'util/navigation'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'

export default function FeedBanner ({
  context,
  currentUserHasMemberships,
  currentUser,
  customActivePostsOnly,
  customPostTypes,
  customViewTopics,
  label,
  isCustomView,
  icon,
  group,
  newPost,
  querystringParams,
  routeParams,
  isTesting,
  type
}) {
  let bannerUrl, avatarUrl, name, location, subtitle

  if (context === 'all') {
    name = 'All My Groups'
    avatarUrl = whiteMerkaba
    bannerUrl = allGroupsBanner
    subtitle = currentUser && `${currentUser.memberships.count()} Groups`
  } else if (context === 'public') {
    name = 'Public Groups & Posts'
    avatarUrl = publicGlobe
    bannerUrl = allGroupsBanner
    // TODO list count of public posts and public groups in subtitle
    subtitle = `All Posts Marked Public`
  } else if (!group) {
    return null
  } else {
    ({ bannerUrl, avatarUrl, name, location } = group)
  }

  let numCustomFilters = isCustomView ? (customPostTypes.length + customViewTopics.length + (customActivePostsOnly ? 1 : 0)) : false

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

            {numCustomFilters
              ? <div styleName='num-filters' data-tip='' data-for='feed-banner-tip'>{numCustomFilters} Filters</div>
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
        return (isCustomView
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
    />}
  </div>
}

export function postPromptString (type = '', { firstName }) {
  const postPrompts = {
    offer: `Hi ${firstName}, what would you like to share?`,
    request: `Hi ${firstName}, what are you looking for?`,
    project: `Hi ${firstName}, what would you like to create?`,
    event: `Hi ${firstName}, want to create an event?`,
    default: `Hi ${firstName}, what's on your mind?`
  }

  return postPrompts[type] || postPrompts['default']
}

export class PostPrompt extends React.Component {
  static defaultProps = {
    firstName: '',
    promptStringFunc: postPromptString,
    querystringParams: {},
    routeParams: {},
    type: ''
  }

  constructor (props) {
    super(props)
    this.state = { hover: false }
  }

  onMouseEnterHandler = () => this.setState({ hover: true })

  onMouseLeaveHandler = () => this.setState({ hover: false })

  render () {
    const { avatarUrl, className, firstName, type, promptStringFunc, querystringParams, routeParams } = this.props
    const { hover } = this.state

    return <div onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler}>
      <Link to={createPostUrl(routeParams, { ...querystringParams, newPostType: type })}>
        <div styleName='postPrompt' className={className}>
          <RoundImage url={avatarUrl} small styleName='prompt-image' />
          {promptStringFunc(type, { firstName })}
        </div>
      </Link>
      <div styleName={cx('shadow', { hover })} />
    </div>
  }
}
