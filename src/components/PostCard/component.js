/* eslint-disable camelcase */
import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import PostLabel from 'components/PostLabel'
import RoundImage from 'components/RoundImage'
import { personUrl, bgImageStyle, humanDate } from 'util/index'
import { parse } from 'url'
import './component.scss'
import samplePost from './samplePost'
const { shape, any, object, string, func, array } = React.PropTypes

export default class PostCard extends React.Component {
  render () {
    const { post, className } = this.props

    console.log('post', post)

    return <div styleName='card' className={className}>
      <PostHeader creator={post.creator}
        date={post.updatedAt || post.createdAt}
        type={post.type}
        context={post.context}
        communities={post.communities} />
      <PostBody title={post.title}
        details={post.details}
        imageUrl={post.imageUrl}
        linkPreview={post.linkPreview} />
      <PostFooter id={post.id}
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        votesTotal={post.votesTotal} />
    </div>
  }
}
PostCard.propTypes = {
  post: shape({
    id: any,
    type: string,
    creator: object,
    name: string,
    description: string,
    commenters: array,
    upVotes: string,
    updated_at: string
  }),
  fetchPost: func
}
PostCard.defaultProps = {
  post: samplePost
}

export const PostHeader = ({ creator, date, type, context, communities }) => {
  return <div styleName='header'>
    <Avatar avatarUrl={creator.avatarUrl} url={personUrl(creator)} styleName='avatar' />
    <div styleName='headerText'>
      <Link to={personUrl(creator)} styleName='userName'>{creator.name}{creator.title && ', '}</Link>
      {creator.title && <span styleName='userTitle'>{creator.title}</span>}
      <div>
        <span className='timestamp'>
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
    </div>
  </div>
}

export const PostBody = ({ title, details, imageUrl, linkPreview }) => {
  // TODO: Present details as HTML and sanitize
  const truncated = details &&
    details.length > 147
    ? details.slice(0, 144) + '...'
    : details

  return <div styleName='body'>
    {imageUrl && <div style={bgImageStyle(imageUrl)} styleName='image' />}
    <div styleName='title' className='hdr-headline'>{title}</div>
    {truncated && <div styleName='description'>{truncated}</div>}
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
    <span className='caption-lt-lg'>{commentCaption(commenters, commentersTotal)}</span>
    <div styleName='votes'><a href='' className='text-button'><Icon name='ArrowUp' styleName='arrowIcon' />{votesTotal}</a></div>
  </div>
}

export function PeopleImages ({ imageUrls, className }) {
  const images = imageUrls.map((url, i) =>
    <RoundImage url={url} key={i} medium overlaps />)
  return <div className={className}>{images}</div>
}
