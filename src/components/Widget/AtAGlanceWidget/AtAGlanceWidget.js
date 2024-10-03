import React from 'react'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'lodash'
import FancyLink from 'components/FancyLink'
import { getSocialMedia, getWebsite, getAtAGlance } from 'store/selectors/farmExtensionSelectors'
import { FarmDetailSection } from '../FarmDetailsWidget/FarmDetailsWidget'
import classes from './AtAGlanceWidget.module.scss'
import { sanitizeURL } from 'util/url'

export default function AtAGlanceWidget ({ group }) {
  /*
    - at a glance
    - website
    - social media
  */
  const socialMedia = sanitizeURL(getSocialMedia(group))
  const website = sanitizeURL(getWebsite(group))
  const atAGlance = getAtAGlance(group)
  const { t } = useTranslation()

  return (
    <div className={classes.atAGlanceContainer}>
      {atAGlance.length > 0 && <FarmDetailSection items={atAGlance.map((item) => capitalize(item))} />}
      {website && <FancyLink iconName='Website' target='_blank' linkUrl={website} title={t(`Website for {{group.name}}`, { group })} />}
      {socialMedia && <FancyLink iconName='Socials' target='_blank' linkUrl={socialMedia} title={t(`Social media link for {{group.name}}`, { group })} />}
    </div>
  )
}
