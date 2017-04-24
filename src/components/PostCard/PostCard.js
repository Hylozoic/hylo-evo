/* eslint-disable camelcase */
import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import PostLabel from 'components/PostLabel'
import RoundImage from 'components/RoundImage'
import { personUrl, bgImageStyle } from 'util/index'
import { sanitize, present, textLength, truncate, appendInP, humanDate } from 'hylo-utils/text'
import { parse } from 'url'
import './PostCard.scss'
import samplePost from './samplePost'
import { get } from 'lodash/fp'
import cx from 'classnames'

const { shape, any, object, string, func, array, bool } = React.PropTypes

export default class PostCard extends React.Component {
  static propTypes = {
    post: shape({
      id: any,
      type: string,
      creator: object,
      name: string,
      details: string,
      commenters: array,
      upVotes: string,
      updatedAt: string
    }),
    fetchPost: func,
    expanded: bool,
    showDetails: func
  }

  static defaultProps = {
    post: samplePost()
  }

  render () {
    const { post, className, expanded, showDetails } = this.props
    const slug = get('0.slug', post.communities)

    return <div styleName={cx('card', {expanded})} className={className}
      onClick={showDetails}>
      <PostHeader creator={post.creator}
        date={post.updatedAt || post.createdAt}
        type={post.type}
        context={post.context}
        communities={post.communities}
        slug={slug} />
      <PostImage imageUrl={post.imageUrl} />
      <PostBody title={post.title}
        id={post.id}
        details={post.details}
        linkPreview={post.linkPreview}
        slug={slug} />
      <PostFooter id={post.id}
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        votesTotal={post.votesTotal} />
    </div>
  }
}

export const PostHeader = ({ creator, date, type, context, communities, close, className, slug }) => {
  return <div styleName='header' className={className}>
    <Avatar avatarUrl={creator.avatarUrl} url={personUrl(creator.id, slug)} styleName='avatar' />
    <div styleName='headerText'>
      <Link to={personUrl(creator.id, slug)} styleName='userName'>{creator.name}{creator.tagline && ', '}</Link>
      {creator.tagline && <span styleName='userTitle'>{creator.tagline}</span>}
      <div>
        <span styleName='timestamp'>
          {humanDate(date)}{context && <span styleName='spacer'>•</span>}
        </span>
        {context && <Link to='/' styleName='context'>
          {context}
        </Link>}
      </div>
    </div>
    <div styleName='upperRight'>
      {type && <PostLabel type={type} styleName='label' />}
      <Dropdown toggleChildren={<Icon name='More' />} triangle items={[
        {icon: 'Pin', label: 'Pin', onClick: () => console.log('Pin')},
        {icon: 'Flag', label: 'Flag', onClick: () => console.log('Flag')},
        {icon: 'Trash', label: 'Delete', onClick: () => console.log('Delete')},
        {label: 'Other'},
        {icon: 'Complete', label: 'Accept and mark complete', onClick: () => console.log('Accept and mark complete')}
      ]} />
      {close && <a styleName='close' onClick={close}><Icon name='Ex' /></a>}
    </div>
  </div>
}

export const PostImage = ({ imageUrl, className }) => {
  if (!imageUrl) return null
  return <div style={bgImageStyle(imageUrl)} styleName='image' className={className} />
}

const maxDetailsLength = 144

export const PostBody = ({ id, title, details, imageUrl, linkPreview, slug, expanded, className }) => {
  // TODO: Present details as HTML and sanitize
  let presentedDetails = present(sanitize(details), {slug})
  const shouldTruncate = !expanded && textLength(presentedDetails) > maxDetailsLength
  if (shouldTruncate) {
    presentedDetails = truncate(presentedDetails, maxDetailsLength)
  }
  if (presentedDetails) presentedDetails = appendInP(presentedDetails, '&nbsp;')

  return <div styleName='body' className={className}>
    <div styleName='title' className='hdr-headline'>{title}</div>
    {presentedDetails && <div styleName='description' dangerouslySetInnerHTML={{__html: presentedDetails}} />}
    {linkPreview && <LinkPreview {...linkPreview} />}
  </div>
}

export const LinkPreview = ({ title, url, imageUrl }) => {
  const domain = parse(url).hostname.replace('www.', '')
  return <div styleName='cardPadding'>
    <div styleName='linkPreview'>
      <a href={url} target='_blank'>
        <div style={bgImageStyle(imageUrl)} styleName='previewImage' />
        <div styleName='previewText'>
          <span styleName='previewTitle'>{title}</span>
          <div styleName='previewDomain'>{domain}</div>
        </div>
      </a>
    </div>
  </div>
}

export const commentCaption = (commenters, commentersTotal) => {
  var names = ''
  const firstName = person => person.name.split(' ')[0]
  if (commentersTotal === 0) {
    return 'Be the first to comment'
  } else if (commentersTotal === 1) {
    names = firstName(commenters[0])
  } else if (commentersTotal === 2) {
    names = `${firstName(commenters[0])} and ${firstName(commenters[1])}`
  } else {
    names = `${firstName(commenters[0])}, ${firstName(commenters[1])} and ${commentersTotal - 2} other${commentersTotal - 2 > 1 ? 's' : ''}`
  }
  return `${names} commented`
}

export const PostFooter = ({ id, commenters, commentersTotal, votesTotal }) => {
  return <div styleName='footer'>
    <PeopleImages imageUrls={(commenters).map(c => c.avatarUrl)} styleName='people' />
    <span styleName='caption'>{commentCaption(commenters, commentersTotal)}</span>
    <div styleName='votes'><a href='' className='text-button'><Icon name='ArrowUp' styleName='arrowIcon' />{votesTotal}</a></div>
  </div>
}

export function PeopleImages ({ imageUrls, className }) {
  const images = imageUrls.map((url, i) =>
    <RoundImage url={url} key={i} medium overlaps />)
  return <div className={className}>{images}</div>
}
