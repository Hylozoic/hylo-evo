import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from 'components/Button'
import { axolotlDigging } from 'util/assets'
import classes from './TopicSupportComingSoon.module.scss'

export default function TopicSupportComingSoon () {
  const { t } = useTranslation()
  return <div className={classes.container}>
    <h1>{t(`We're working on expanding\n#topics to more places`)}</h1>
    <p className={classes.grayText}>{t('In the meantime, click a topic from an individual\ngroup to see posts from that group.')}</p>
    <Link to='/all'>
      <Button className={classes.backButton}>{t('Return to All Groups')}</Button>
    </Link>
    <img className={classes.axolotlDiggingImage} src={axolotlDigging} />
  </div>
}
