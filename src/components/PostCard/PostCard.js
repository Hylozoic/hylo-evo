/* eslint-disable camelcase */
import React from 'react'
import { bgImageStyle } from 'util/index'
import { sanitize, present, textLength, truncate, appendInP } from 'hylo-utils/text'
import { parse } from 'url'
import PostHeader from './PostHeader'
import PostFooter from './PostFooter'
import './PostCard.scss'
import samplePost from './samplePost'
import { get } from 'lodash/fp'
import cx from 'classnames'
import { decode } from 'ent'
export { PostHeader, PostFooter }

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
    showDetails: func,
    showCommunity: bool
  }

  static defaultProps = {
    post: samplePost()
  }

  render () {
    const { post, className, expanded, showDetails, showCommunity } = this.props
    const slug = get('0.slug', post.communities)

    const shouldShowDetails = element => {
      if (element === this.refs.postCard) return true
      if (element.tagName === 'A') return false

      const parent = element.parentElement
      if (parent) return shouldShowDetails(parent)

      return true
    }

    const onClick = event => {
      const { target } = event

      if (shouldShowDetails(target)) showDetails()
    }

    return <div ref='postCard'styleName={cx('card', {expanded})} className={className}
      onClick={onClick}>
      <PostHeader creator={post.creator}
        date={post.updatedAt || post.createdAt}
        type={post.type}
        showCommunity={showCommunity}
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
        votesTotal={post.votesTotal}
        myVote={post.myVote} />
    </div>
  }
}

export const PostImage = ({ imageUrl, className }) => {
  if (!imageUrl) return null
  return <div style={bgImageStyle(imageUrl)} styleName='image' className={className} />
}

const maxDetailsLength = 144

export const PostBody = ({ id, title, details, imageUrl, linkPreview, slug, expanded, className }) => {
  const decodedTitle = decode(title)

  let presentedDetails = present(sanitize(details), {slug})
  const shouldTruncate = !expanded && textLength(presentedDetails) > maxDetailsLength
  if (shouldTruncate) {
    presentedDetails = truncate(presentedDetails, maxDetailsLength)
  }
  if (presentedDetails) presentedDetails = appendInP(presentedDetails, '&nbsp;')

  return <div styleName='body' className={className}>
    <div styleName='title' className='hdr-headline'>{decodedTitle}</div>
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
