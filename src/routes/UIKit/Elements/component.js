import React from 'react'
import RoundImage from 'components/RoundImage'
import Button from 'components/Button'
import PostLabel from 'components/PostLabel'
import SkillLabel from 'components/SkillLabel'

import layout from '../css/layout.scss'  // eslint-disable-line no-unused-vars
import s from './component.scss' // eslint-disable-line no-unused-vars

const SAMPLE_IMAGE_URL = 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'

export default function Elements (props) {
  return <div>
    <div styleName='layout.sheet'>
      <div styleName='layout.sheet-title'>Elements</div>
      <div styleName='layout.sheet-flexbox'>
        <div>
          <div styleName='s.elementLabel'>Imagery</div>
          <div styleName='s.imagesCard'>
            <RoundImage url={SAMPLE_IMAGE_URL} styleName='s.imageMargin' />
            <RoundImage url={SAMPLE_IMAGE_URL} styleName='s.imageMargin' medium />
            <RoundImage url={SAMPLE_IMAGE_URL} styleName='s.imageMargin' small />
          </div>
          <div>
            <span styleName='s.imageLabel'>40px</span>
            <span styleName='s.imageLabel'>32px</span>
            <span styleName='s.imageLabel'>24px</span>
          </div>
        </div>
        <div styleName='s.buttonsCard'>
          <div styleName='s.elementLabel'>Buttons / 40px</div>
          <div styleName='s.buttonRow'>
            <div styleName='s.buttonRow_label'>Normal</div>
            <Button label='Button' styleName='s.buttonMargin' />
            <Button label='Button' color='purple' styleName='s.buttonMargin' />
            <Button label='Button' color='green-white' styleName='s.buttonMargin' narrow />
          </div>
          <div styleName='s.buttonRow'>
            <div styleName='s.buttonRow_label'>Hover</div>
            <Button label='Button' styleName='s.buttonMargin' hover />
            <Button label='Button' color='purple' styleName='s.buttonMargin' hover />
            <Button label='Button' color='green-white' styleName='s.buttonMargin' narrow hover />
          </div>
          <div styleName='s.buttonRow'>
            <div styleName='s.buttonRow_label'>Clicked</div>
            <Button label='Button' styleName='s.buttonMargin' active />
            <Button label='Button' color='purple' styleName='s.buttonMargin' active />
            <Button label='Button' color='green-white' styleName='s.buttonMargin' narrow active />
          </div>
          <div styleName='s.buttonRow'>
            <div styleName='s.buttonRow_label'>Other</div>
            <Button label='Button' color='gray' styleName='s.buttonMargin' />
            <Button label='Button' color='gray-blank' styleName='s.buttonMargin' />
            <Button label='Button' color='green-white-green-border' styleName='s.buttonMargin' narrow />
          </div>
        </div>
        <div>
          <div styleName='s.elementLabel'>Buttons / 32px</div>
          <div styleName='s.buttonRow-small'>
            <Button label='Button' styleName='s.buttonMargin' small />
            <Button label='Button' color='purple' styleName='s.buttonMargin' small />
          </div>
          <div styleName='s.buttonRow-small'>
            <Button label='Button' styleName='s.buttonMargin' hover small />
            <Button label='Button' color='purple' styleName='s.buttonMargin' hover small />
          </div>
          <div styleName='s.buttonRow-small'>
            <Button label='Button' styleName='s.buttonMargin' active small />
            <Button label='Button' color='purple' styleName='s.buttonMargin' active small />
          </div>
          <div styleName='s.buttonRow-small'>
            <Button label='Button' color='gray' styleName='s.buttonMargin' small />
            <div styleName='s.buttonBackground-rhino'>
              <Button label='Button' color='white' small />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div styleName='s.elementLabel'>Labels</div>
        <div styleName='layout.sheet-flexbox' className='mb-5'>
          <div styleName='layout.sheet-flexbox-item'>
            <PostLabel type='discussion' />
          </div>
          <div styleName='layout.sheet-flexbox-item'>
            <PostLabel type='event' />
          </div>
          <div styleName='layout.sheet-flexbox-item'>
            <PostLabel type='offer' />
          </div>
          <div styleName='layout.sheet-flexbox-item'>
            <PostLabel type='project' />
          </div>
          <div styleName='layout.sheet-flexbox-item'>
            <PostLabel type='request' />
          </div>
        </div>
        <div>
          <div styleName='s.skillContainer layout.sheet-flexbox-item'>
            <SkillLabel label='skill' />
          </div>
          <div styleName='s.skillContainer layout.sheet-flexbox-item'>
            <SkillLabel label='skill' active />
          </div>
          <div styleName='s.skillContainer s.skillBackground-rhino layout.sheet-flexbox-item'>
            <SkillLabel label='skill' color='white' />
          </div>
          <div styleName='s.skillContainer s.skillBackground-rhino layout.sheet-flexbox-item'>
            <SkillLabel label='skill' color='white' active />
          </div>
          <div styleName='layout.sheet-flexbox-item'>
            <span />
          </div>
        </div>
      </div>
    </div>
  </div>
}
