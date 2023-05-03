import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from 'components/Button'
import { axolotlDigging } from 'util/assets'
import './TopicSupportComingSoon.scss'

export default function TopicSupportComingSoon () {
  const { t } = useTranslation()
  return <div styleName='container'>
    <h1>{t(`We're working on expanding\n#topics to more places`)}</h1>
    <p styleName='gray-text'>{t('In the meantime, click a topic from an individual\ngroup to see posts from that group.')}</p>
    <Link to='/all'>
      <Button styleName='back-button'>{t('Return to All Groups')}</Button>
    </Link>
    <img styleName='axolotl-digging-image' src={axolotlDigging} />
  </div>
}
