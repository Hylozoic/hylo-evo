/* eslint-disable camelcase */
import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import PostLabel from 'components/PostLabel'
import RoundImage from 'components/RoundImage'
import ShareButton from './ShareButton'
import { personUrl, bgImageStyle, humanDate } from 'util/index'
import CSSModules from 'react-css-modules'
import styles from './component.scss'
import samplePost from './samplePost'

const { shape, any, object, string, func, array } = React.PropTypes

export default class PostCard extends React.Component {
  componentDidMount () {
    const { id, fetchPost } = this.props
    fetchPost(id)
  }
  render () {
    const { post, className } = this.props
    return <div styleName='card' className={className}>
      <PostHeader {...post} />
      <PostBody {...post} />
      <PostFooter {...post} />
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
  }),
  fetchPost: func.isRequired
}
PostCard.defaultProps = {
  post: samplePost
}

export const PostHeader = CSSModules(({ author, updatedAt, type, context, communities }) => {
  return <div styleName='header'>
    <Avatar avatarUrl={author.avatarUrl} url={personUrl(author)} styleName='avatar' />
    <div styleName='headerText'>
      <Link to={personUrl(author)} styleName='userName'>{author.name}{author.title && ', '}</Link>
      {author.title && <span styleName='userTitle'>{author.title}</span>}
      <div>
        <span className='timestamp'>
          {humanDate(updatedAt)}{context && <span styleName='spacer'>•</span>}
        </span>
        {context && <Link to='/' styleName='context'>
          {context}
        </Link>}
      </div>
    </div>
    <div styleName='upperRight'>
      {type && <PostLabel type={type} styleName='label' />}
      <a href='' styleName='menuLink'><Icon name='More' /></a>
    </div>
  </div>
}, styles)

export const PostBody = CSSModules(({ title, description, imageUrl, linkPreview }) => {
  // TODO: Present description as HTML and sanitize
  const truncated = description &&
    description.length > 147
    ? description.slice(0, 144) + '...'
    : description

  return <div styleName='body'>
    {imageUrl && <div style={bgImageStyle(imageUrl)} styleName='image' />}
    <div styleName='title' className='hdr-headline'>{title}</div>
    {truncated && <div styleName='description'>{truncated}</div>}
    {linkPreview && <LinkPreview {...linkPreview} />}
  </div>
}, styles)

export const LinkPreview = CSSModules(({ title, url, imageUrl }) => {
  const domain = (new window.URL(url)).hostname.replace('www.', '')
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
}, styles)

export const commentCaption = (commenters, commentersTotal) => {
  var names = ''
  if (commenters.length === 0) {
    return 'Be the first to comment'
  } else if (commenters.length === 1) {
    names = commenters[0].firstName
  } else if (commenters.length === 2) {
    names = `${commenters[0].firstName} and ${commenters[1].firstName}`
  } else {
    names = `${commenters[0].firstName}, ${commenters[1].firstName} and ${commentersTotal - 2} others`
  }
  return `${names} commented`
}

export const PostFooter = CSSModules(({ id, commenters, commentersTotal, voteCount }) => {
  return <div styleName='footer'>
    <PeopleImages imageUrls={commenters.map(c => c.avatarUrl)} styleName='people' />
    <span className='caption-lt-lg'>{commentCaption(commenters, commentersTotal)}</span>
    <div styleName='share'><ShareButton postId={id} /></div>
    <div styleName='votes'><a href='' className='text-button'><Icon name='ArrowUp' styleName='arrowIcon' />{voteCount}</a></div>
  </div>
}, styles)

export function PeopleImages ({ imageUrls, className }) {
  const images = imageUrls.map((url, i) =>
    <RoundImage url={url} key={i} medium overlaps />)
  return <div className={className}>{images}</div>
}
