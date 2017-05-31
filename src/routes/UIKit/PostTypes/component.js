import React from 'react'
import PostCard from 'components/PostCard'
import PostEditor from 'components/PostEditor'
import { omit } from 'lodash/fp'
import './component.scss'
import samplePost, { fakePerson, SAMPLE_IMAGE_URL } from 'components/PostCard/samplePost'

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

const SAMPLE_POST_FOR_EDITOR = {
  type: 'offer',
  title: 'This is a Post title',
  details: 'This is a test <a href="/u/1" data-user-id="99" data-entity-type="mention">Loren Johnson</a> and the remaining text <a data-entity-type="topic">#Environment</a> text betweeen hastags <a data-entity-type="#mention">#OurTopic</a>'
}

export default function PostTypes (props) {
  return <div>
    <div className='sheet'>
      <div className='sheet-title'>Post Editor</div>
      <div styleName='postCards'>
        <PostEditor post={SAMPLE_POST_FOR_EDITOR}
          communityOptions={[
            {id: '1', name: 'Acorn Place'},
            {id: '2', name: 'Bagel People'},
            {id: '3', name: 'Common Purpose'},
            {id: '4', name: 'Dancing Penpals'}
          ]}/>
      </div>
      <div className='sheet-title'>Post Types</div>
      <div styleName='postCards'>
        <PostCard post={SAMPLE_POST} styleName='postCard' />
        <h4>with image</h4>
        <PostCard post={SAMPLE_POST_WITH_IMAGE} styleName='postCard' />
        <h4>with description and community link</h4>
        <PostCard post={SAMPLE_POST_WITH_DESCRIPTION} styleName='postCard' showCommunity />
        <h4>with long description</h4>
        <PostCard post={SAMPLE_POST_WITH_LONG_DESCRIPTION} styleName='postCard' />
        <h4>with link preview</h4>
        <PostCard post={SAMPLE_POST_WITH_PREVIEW} styleName='postCard' />
      </div>
    </div>
  </div>
}
