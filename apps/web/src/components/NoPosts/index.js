import React from 'react'
import { useTranslation } from 'react-i18next'
import './NoPosts.scss'

import { jollyAxolotl } from 'util/assets'

const NoPosts = ({ message, className }) => {
  const { t } = useTranslation()
  const tMessage = message || t('Nothing to see here')
  return (
    <div styleName='no-posts' className={className}>
      <img src={jollyAxolotl} />
      <br />
      <div><h2>{tMessage}</h2></div>
    </div>
  )
}

export default NoPosts
