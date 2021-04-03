import React from 'react'
import { Link } from 'react-router-dom'
import Button from 'components/Button'
import { axolotlDigging } from 'util/assets'
import './TopicSupportComingSoon.scss'

export default function TopicSupportComingSoon () {
  return <div styleName='container'>
    <h1>We're working on expanding<br />#topics to more places</h1>
    <p styleName='gray-text'>In the meantime, click a topic from an individual<br />group to see posts from that group.</p>
    <Link to='/all'>
      <Button styleName='back-button'>Return to All Groups</Button>
    </Link>
    <img styleName='axolotl-digging-image' src={axolotlDigging} />
  </div>
}
