import React, { PureComponent } from 'react'
import PostTitle from '../PostTitle'
import PostDetails from '../PostDetails'
import './PostBody.scss'
import cx from 'classnames'

export default class PostBody extends PureComponent {
  static defaultProps = {
    routeParams: {}
  }

  render () {
    const {
      slug,
      expanded,
      className,
      highlightProps,
      fulfillPost,
      unfulfillPost,
      canEdit,
      ...post
    } = this.props

    return <div styleName={cx('body', { smallMargin: !expanded })} className={className}>
      <PostTitle {...post} highlightProp={highlightProps} />
      <PostDetails {...post}
        slug={slug}
        highlightProp={highlightProps}
        expanded={expanded}
        fulfillPost={fulfillPost}
        unfulfillPost={unfulfillPost}
        canEdit={canEdit} />
    </div>
  }
}
