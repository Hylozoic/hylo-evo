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
      routeParams,
      expanded,
      className,
      constrained,
      highlightProps,
      fulfillPost,
      unfulfillPost,
      canEdit,
      ...post
    } = this.props

    return <div styleName={cx('body', { smallMargin: !expanded }, { constrained })} className={className}>
      <PostTitle {...post}
        highlightProp={highlightProps}
        constrained={constrained}
      />
      <PostDetails {...post}
        slug={slug}
        highlightProp={highlightProps}
        expanded={expanded}
        constrained={constrained}
        fulfillPost={fulfillPost}
        unfulfillPost={unfulfillPost}
        canEdit={canEdit} />
    </div>
  }
}
