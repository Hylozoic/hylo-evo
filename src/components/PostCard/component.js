/* eslint-disable camelcase */
import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import PostLabel from 'components/PostLabel'
import RoundImage from 'components/RoundImage'
import { personUrl, bgImageStyle } from 'utils'
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
          {updated_at}{context && <span styleName='spacer'>•</span>}
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

export const PostBody = CSSModules(({ post }) => {
  return <div styleName='body'>
    {post.imageUrl && <img src={post.imageUrl} styleName='image' />}
    <div styleName='title' className='hdr-headline'>{post.title}</div>
  </div>
}, styles)

export const PostFooter = CSSModules(({ post }) => {
  return <div styleName='footer'>
    <PeopleImages imageUrls={post.commenters.map(c => c.avatarUrl)} styleName='people' />
    <span className='caption-lt-lg'>Steph, Cam, and 58 others commented</span>
    <div styleName='share'><a href=''><Icon name='Share' /></a></div>
    <div styleName='votes'><a href='' className='text-button'><Icon name='ArrowUp' styleName='arrowIcon' />{post.voteCount}</a></div>
  </div>
}, styles)

export function PeopleImages ({ imageUrls, className }) {
  const images = imageUrls.map(url =>
    <RoundImage url={url} key={url} medium overlaps />)
  return <div className={className}>{images}</div>
}
