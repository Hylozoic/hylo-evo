/* eslint-disable camelcase */
import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import PostLabel from 'components/PostLabel'
import { personUrl } from 'utils'
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

export const PostHeader = CSSModules(({ post: { user, user: { name }, updated_at, type } }) => {
  return <div styleName='header'>
    <Avatar person={user} styleName='avatar' />
    <div styleName='nameAndDate'>
      <Link to={personUrl(user)} styleName='name' className='hdr-minor'>{name}</Link>
      <div styleName='date' className='timestamp'>{updated_at}</div>
    </div>
    <PostLabel type={type} styleName='label' />
    <Link to='/' styleName='menuLink'><Icon name='More' /></Link>
  </div>
}, styles)

export const PostBody = CSSModules(({ post }) => {
  return <div styleName='body'>
    Body
  </div>
}, styles)

export const PostFooter = CSSModules(({ post }) => {
  return <div styleName='footer'>
    Footer
  </div>
}, styles)
