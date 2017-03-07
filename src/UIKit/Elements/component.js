import React from 'react'
import RoundImage from 'App/components/RoundImage'
import Button from 'App/components/Button'
import PostLabel from 'App/components/PostLabel'
import SkillLabel from 'App/components/SkillLabel'

const SAMPLE_IMAGE_URL = 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'

export default function Elements (props) {
  return <div>
    <div className='sheet'>
      <div className='sheet-title'>Elements</div>
      <div className='sheet-flexbox'>
        <div>
          <div styleName='elementLabel'>Imagery</div>
          <div styleName='imagesCard'>
            <RoundImage url={SAMPLE_IMAGE_URL} styleName='imageMargin' />
            <RoundImage url={SAMPLE_IMAGE_URL} styleName='imageMargin' medium />
            <RoundImage url={SAMPLE_IMAGE_URL} styleName='imageMargin' small />
          </div>
          <div>
            <span styleName='imageLabel'>40px</span>
            <span styleName='imageLabel'>32px</span>
            <span styleName='imageLabel'>24px</span>
          </div>
        </div>
        <div styleName='buttonsCard'>
          <div styleName='elementLabel'>Buttons / 40px</div>
          <div styleName='buttonRow'>
            <div styleName='buttonRow_label'>Normal</div>
            <Button label='Button' styleName='buttonMargin' />
            <Button label='Button' color='purple' styleName='buttonMargin' />
            <Button label='Button' color='green-white' styleName='buttonMargin' narrow />
          </div>
          <div styleName='buttonRow'>
            <div styleName='buttonRow_label'>Hover</div>
            <Button label='Button' styleName='buttonMargin' hover />
            <Button label='Button' color='purple' styleName='buttonMargin' hover />
            <Button label='Button' color='green-white' styleName='buttonMargin' narrow hover />
          </div>
          <div styleName='buttonRow'>
            <div styleName='buttonRow_label'>Clicked</div>
            <Button label='Button' styleName='buttonMargin' active />
            <Button label='Button' color='purple' styleName='buttonMargin' active />
            <Button label='Button' color='green-white' styleName='buttonMargin' narrow active />
          </div>
          <div styleName='buttonRow'>
            <div styleName='buttonRow_label'>Other</div>
            <Button label='Button' color='gray' styleName='buttonMargin' />
            <Button label='Button' color='gray-blank' styleName='buttonMargin' />
            <Button label='Button' color='green-white-green-border' styleName='buttonMargin' narrow />
          </div>
        </div>
        <div>
          <div styleName='elementLabel'>Buttons / 32px</div>
          <div styleName='buttonRow-small'>
            <Button label='Button' styleName='buttonMargin' small />
            <Button label='Button' color='purple' styleName='buttonMargin' small />
          </div>
          <div styleName='buttonRow-small'>
            <Button label='Button' styleName='buttonMargin' hover small />
            <Button label='Button' color='purple' styleName='buttonMargin' hover small />
          </div>
          <div styleName='buttonRow-small'>
            <Button label='Button' styleName='buttonMargin' active small />
            <Button label='Button' color='purple' styleName='buttonMargin' active small />
          </div>
          <div styleName='buttonRow-small'>
            <Button label='Button' color='gray' styleName='buttonMargin' small />
            <div styleName='buttonBackground-rhino'>
              <Button label='Button' color='white' small />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div styleName='elementLabel'>Labels</div>
        <div className='sheet-flexbox mb-5'>
          <div className='sheet-flexbox-item'>
            <PostLabel type='discussion' />
          </div>
          <div className='sheet-flexbox-item'>
            <PostLabel type='event' />
          </div>
          <div className='sheet-flexbox-item'>
            <PostLabel type='offer' />
          </div>
          <div className='sheet-flexbox-item'>
            <PostLabel type='project' />
          </div>
          <div className='sheet-flexbox-item'>
            <PostLabel type='request' />
          </div>
        </div>
        <div>
          <div styleName='skillContainer' className='sheet-flexbox-item'>
            <SkillLabel label='skill' />
          </div>
          <div styleName='skillContainer' className='sheet-flexbox-item'>
            <SkillLabel label='skill' active />
          </div>
          <div styleName='skillContainer skillBackground-rhino' className='sheet-flexbox-item'>
            <SkillLabel label='skill' color='white' />
          </div>
          <div styleName='skillContainer skillBackground-rhino' className='sheet-flexbox-item'>
            <SkillLabel label='skill' color='white' active />
          </div>
          <div className='sheet-flexbox-item'>
            <span />
          </div>
        </div>
      </div>
    </div>
  </div>
}
