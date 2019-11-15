import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import PostTopics from '../PostTopics'
import PostLabel from 'components/PostLabel'
import Highlight from 'components/Highlight'
import FlagContent from 'components/FlagContent'
import Icon from 'components/Icon'
import { personUrl } from 'util/navigation'
import { humanDate } from 'hylo-utils/text'
import './PostHeader.scss'
import { filter, isFunction, isEmpty } from 'lodash'

export default class PostHeader extends PureComponent {
  static defaultProps = {
    routeParams: {},
    topicsInline: false
  }

  state = {
    flaggingVisible: false
  }

  flagPostFunc = () =>
    this.props.canFlag ? () => { this.setState({ flaggingVisible: true }) } : undefined

  render () {
    const {
      routeParams,
      creator,
      createdAt,
      type,
      id,
      pinned,
      topics,
      close,
      className,
      editPost,
      deletePost,
      removePost,
      pinPost,
      highlightProps,
      topicsInline,
      announcement
    } = this.props

    if (!creator) return null

    const creatorUrl = personUrl(creator.id, routeParams.slug, routeParams.networkSlug)
    const { flaggingVisible } = this.state
    // Used to generate a link to this post from the backend.
    const flagPostData = {
      slug: routeParams.slug,
      id: id,
      type: 'post'
    }
    const dropdownItems = filter([
      { icon: 'Pin', label: pinned ? 'Unpin' : 'Pin', onClick: pinPost },
      { icon: 'Edit', label: 'Edit', onClick: editPost },
      { icon: 'Flag', label: 'Flag', onClick: this.flagPostFunc() },
      { icon: 'Trash', label: 'Delete', onClick: deletePost, red: true },
      { icon: 'Trash', label: 'Remove From Community', onClick: removePost, red: true }
    ], item => isFunction(item.onClick))

    return <div styleName='header' className={className}>
      <div styleName='headerMainRow'>
        <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' />
        <div styleName='headerText'>
          <Highlight {...highlightProps}>
            <Link to={creatorUrl} styleName='userName'>{creator.name}{creator.tagline && ', '}</Link>
          </Highlight>
          {creator.tagline && <span styleName='userTitle'>{creator.tagline}</span>}
          <div styleName='timestampRow'>
            <span styleName='timestamp'>
              {humanDate(createdAt)}
            </span>
            {announcement && <span styleName='announcementSection'>
              <span styleName='announcementSpacer'>•</span>
              <span data-tip='Announcement' data-for='announcement-tt'>
                <Icon name='Announcement' styleName='announcementIcon' />
              </span>
              <ReactTooltip
                effect={'solid'}
                delayShow={550}
                id='announcement-tt' />
            </span>}
            {topicsInline && !isEmpty(topics) && <PostTopics topics={topics} slug={routeParams.slug} spacer={Spacer} />}
          </div>
        </div>
        <div styleName='upperRight'>
          {pinned && <Icon name='Pin' styleName='pinIcon' />}
          {type && <PostLabel type={type} styleName='label' />}
          {dropdownItems.length > 0 &&
            <Dropdown toggleChildren={<Icon name='More' />} items={dropdownItems} />}
          {close &&
            <a styleName='close' onClick={close}><Icon name='Ex' /></a>}
        </div>
        {flaggingVisible && <FlagContent type='post'
          linkData={flagPostData}
          onClose={() => this.setState({ flaggingVisible: false })} />
        }
      </div>
      {/* {!topicsInline && !isEmpty(topics) && <PostTopics topics={topics} slug={routeParams.slug} />} */}
    </div>
  }
}

export const Spacer = () =>
  <span styleName='spacer'>•</span>
