/* eslint-disable camelcase */
import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import PostLabel from 'components/PostLabel'
import RoundImage from 'components/RoundImage'
import ShareButton from './ShareButton'
import { personUrl, bgImageStyle, humanDate } from 'util/index'
const { shape, any, object, string, array } = React.PropTypes
import CSSModules from 'react-css-modules'
import styles from './component.scss'

export default function PostCard ({ post, className }) {
  return <div styleName='card' className={className}>
    <PostHeader post={post} />
    <PostBody post={post} />
    <PostFooter post={post} />
  </div>
}
PostCard.propTypes = {
  post: shape({
    id: any,
    type: string,
    user: object,
    name: string,
    description: string,
    commenters: array,
    upVotes: string,
    updated_at: string
  })
}

export const PostHeader = CSSModules(({ post: { user, updated_at, type, context } }) => {
  return <div styleName='header'>
    <Avatar person={user} styleName='avatar' />
    <div styleName='headerText'>
      <Link to={personUrl(user)} styleName='userName'>{user.name}{user.title && ', '}</Link>
      {user.title && <span styleName='userTitle'>{user.title}</span>}
      <div>
        <span className='timestamp'>
          {humanDate(updated_at)}{context && <span styleName='spacer'>•</span>}
        </span>
        {context && <Link to='/' styleName='context'>
          {context}
        </Link>}
      </div>
    </div>
    <PostLabel type={type} styleName='label' />
    <a href='' styleName='menuLink'><Icon name='More' /></a>
  </div>
}, styles)

export const PostBody = CSSModules(({ post, post: { linkPreview } }) => {
  // TODO: Present description as HTML and sanitize
  const truncated = post.description &&
    post.description.length > 147
    ? post.description.slice(0, 144) + '...'
    : post.description

  return <div styleName='body'>
    {post.imageUrl && <img src={post.imageUrl} styleName='image' />}
    <div styleName='title' className='hdr-headline'>{post.title}</div>
    {truncated && <div styleName='description'>{truncated}</div>}
    {linkPreview && <LinkPreview linkPreview={linkPreview} />}
  </div>
}, styles)

export const LinkPreview = CSSModules(({ linkPreview }) => {
  const domain = (new window.URL(linkPreview.url)).hostname.replace('www.', '')
  return <div styleName='cardPadding'>
    <div styleName='linkPreview'>
      <a href={linkPreview.url} target='_blank'>
        <div style={bgImageStyle(linkPreview.imageUrl)} styleName='previewImage' />
        <div styleName='previewText'>
          <span styleName='previewTitle'>{linkPreview.title}</span>
          <div styleName='previewDomain'>{domain}</div>
        </div>
      </a>
    </div>
  </div>
}, styles)

export const commentCaption = ({ commenters, commentCount }) => {
  var names = ''
  if (commenters.length === 0) {
    return 'Be the first to comment'
  } else if (commenters.length === 1) {
    names = commenters[0].firstName
  } else if (commenters.length === 2) {
    names = `${commenters[0].firstName} and ${commenters[1].firstName}`
  } else {
    names = `${commenters[0].firstName}, ${commenters[1].firstName} and ${commentCount - 2} others`
  }
  return `${names} commented`
}

export const PostFooter = CSSModules(({ post }) => {
  return <div styleName='footer'>
    <PeopleImages imageUrls={post.commenters.map(c => c.avatarUrl)} styleName='people' />
    <span className='caption-lt-lg'>{commentCaption(post)}</span>
    <div styleName='share'><ShareButton post={post} /></div>
    <div styleName='votes'><a href='' className='text-button'><Icon name='ArrowUp' styleName='arrowIcon' />{post.voteCount}</a></div>
  </div>
}, styles)

export function PeopleImages ({ imageUrls, className }) {
  const images = imageUrls.map((url, i) =>
    <RoundImage url={url} key={i} medium overlaps />)
  return <div className={className}>{images}</div>
}
