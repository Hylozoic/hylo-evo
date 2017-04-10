import React from 'react'
import PostCard from 'components/PostCard'
import PostEditor from 'components/PostEditor'
import { omit } from 'lodash/fp'
import './component.scss'
import samplePost, { fakePerson } from 'components/PostCard/samplePost'

const SAMPLE_IMAGE_URL = 'https://d3ngex8q79bk55.cloudfront.net/community/1944/banner/1489687099172_ggbridge.jpg'

const SAMPLE_POST = {
  ...samplePost(),
  details: null
}

const SAMPLE_POST_WITH_DESCRIPTION = samplePost()

const SAMPLE_POST_WITH_LONG_DESCRIPTION = {
  ...samplePost(),
  description: `Feel free to print and distribute or if you would like to
    suggest anything we have missed or better clarity, let us know! Feel free to
    print and distribute or if you would like to suggest anything we have missed
    or better clarity, let us know!`
}

const SAMPLE_POST_WITH_IMAGE = {
  ...samplePost(),
  title: 'Three volunteers needed to collect signatures in East Van next weekend',
  type: 'request',
  imageUrl: SAMPLE_IMAGE_URL,
  creator: omit('title', fakePerson())
}

const SAMPLE_POST_WITH_PREVIEW = {
  ...samplePost(),
  type: 'discussion',
  linkPreview: {
    title: 'Indigenous Canadians warn of increased conflicts in 2017',
    url: 'https://www.theguardian.com/technology/2017/mar/11/tim-berners-lee-web-inventor-save-internet',
    imageUrl: 'http://images.tate.org.uk/sites/default/files/images/picasso_pigeon_peas_0.jpg'
  }
}

export default function PostTypes (props) {
  return <div>
    <div className='sheet'>
      <div className='sheet-title'>Post Editor</div>
      <div styleName='postCards'>
        <PostEditor />
      </div>
      <div className='sheet-title'>Post Types</div>
      <div styleName='postCards'>
        <PostCard post={SAMPLE_POST} styleName='postCard' />
        <h4>with image</h4>
        <PostCard post={SAMPLE_POST_WITH_IMAGE} styleName='postCard' />
        <h4>with description</h4>
        <PostCard post={SAMPLE_POST_WITH_DESCRIPTION} styleName='postCard' />
        <h4>with long description</h4>
        <PostCard post={SAMPLE_POST_WITH_LONG_DESCRIPTION} styleName='postCard' />
        <h4>with link preview</h4>
        <PostCard post={SAMPLE_POST_WITH_PREVIEW} styleName='postCard' />
      </div>
    </div>
  </div>
}
