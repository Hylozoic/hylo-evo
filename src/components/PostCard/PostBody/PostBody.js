import React from 'react'
import { decode } from 'ent'
import path from 'path'
import { pick, get } from 'lodash/fp'
import Highlight from 'components/Highlight'
import Icon from 'components/Icon'
import ClickCatcher from 'components/ClickCatcher'
import LinkPreview from '../LinkPreview'
import { sanitize, present, textLength, truncate } from 'hylo-utils/text'
import PostTitle from '../PostTitle'
import PostDetails from '../PostDetails'
import './PostBody.scss'
import cx from 'classnames'

const maxDetailsLength = 144

export default function PostBody ({
  post,
  slug,
  expanded,
  className,
  highlightProps
}) {
  return <div styleName={cx('body', {smallMargin: !expanded})} className={className}>
    <PostTitle {...post} highlightProp={highlightProps} />
    <PostDetails {...post} slug={slug} highlightProp={highlightProps} hideDetails={!expanded} expanded={expanded} />
  </div>
}
