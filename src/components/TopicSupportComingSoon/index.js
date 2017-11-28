import React from 'react'
import { Link } from 'react-router-dom'
import Button from 'components/Button'
import { axolotlDigging } from 'util/assets'
import './TopicSupportComingSoon.scss'

export default function TopicSupportComingSoon () {
  return <div styleName='container'>
    <h1>Were working on expanding<br />#topics to more places</h1>
    <p styleName='gray-text'>In the meantime, click a topic from an individual<br />community to see posts from that community.</p>
    <Link to='/all'>
      <Button styleName='back-button'>Return to All Communities</Button>
    </Link>
    <img styleName='axolotl-digging-image' src={axolotlDigging} />
  </div>
}
