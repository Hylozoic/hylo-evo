/* eslint-disable camelcase */
import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import PostLabel from 'components/PostLabel'
import RoundImage from 'components/RoundImage'
import ShareButton from './ShareButton'
import { personUrl, bgImageStyle } from 'util/index'
import CSSModules from 'react-css-modules'
import styles from './component.scss'
import samplePost from './samplePost'

const { shape, any, object, string, array } = React.PropTypes

export default class PostCard extends React.Component {
  componentDidMount () {
    const { id, fetchPost, match } = this.props
    fetchPost(id)
  }
  render () {
    const { post, className } = this.props
    return <div styleName='card' className={className}>
      <PostHeader post={post} />
      <PostBody post={post} />
      <PostFooter post={post} />
    </div>
  }
}
PostCard.propTypes = {
  post: shape({
    id: any,
    type: string,
    author: object,
    name: string,
    description: string,
    commenters: array,
    upVotes: string,
    updated_at: string
  })
}
PostCard.defaultProps = {
  post: samplePost
}

export const PostHeader = CSSModules(({post: { author: user, updated_at, type, context }}) => {
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

export const PostFooter = CSSModules(({ post }) => {
  return <div styleName='footer'>
    <PeopleImages imageUrls={post.commenters.map(c => c.avatarUrl)} styleName='people' />
    <span className='caption-lt-lg'>Steph, Cam, and 58 others commented</span>
    <div styleName='share'><ShareButton post={post} /></div>
    <div styleName='votes'><a href='' className='text-button'><Icon name='ArrowUp' styleName='arrowIcon' />{post.voteCount}</a></div>
  </div>
}, styles)

export function PeopleImages ({ imageUrls, className }) {
  const images = imageUrls.map(url =>
    <RoundImage url={url} key={url} medium overlaps />)
  return <div className={className}>{images}</div>
}
