import React from 'react'
import SampleCard from 'app/components/SampleCard'

const SAMPLE_IMAGE_URL = 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'

const SAMPLE_AUTHOR = {name: 'Sarah Pham', url: SAMPLE_IMAGE_URL}

const SAMPLE_PEOPLE = [
  {name: 'Steph', url: SAMPLE_IMAGE_URL},
  {name: 'Cam', url: SAMPLE_IMAGE_URL},
  {name: 'Christy', url: SAMPLE_IMAGE_URL},
  {name: 'Sam', url: SAMPLE_IMAGE_URL}
]

const SAMPLE_POST = {
  title: 'We put this together as a PDF for hand-out at your next event or university class',
  body: 'Feel free to print and distribute if you would like to suggest anything we have missed or better clarity, let us know!',
  votesCount: '2564',
  tags: ['activism', 'petition'],
  author: SAMPLE_AUTHOR,
  upVoters: SAMPLE_PEOPLE
}

export default function PostTypes (props) {
  return <div>
    <div className='sheet'>
      <div className='sheet-title'>Post Types</div>
      <div className='sheet-flexbox'>
        <div className='sheet-flexbox-item'>
          <SampleCard post={SAMPLE_POST} />
        </div>
        <div className='sheet-flexbox-item'>
          <SampleCard post={SAMPLE_POST} />
        </div>
      </div>
    </div>
  </div>
}
