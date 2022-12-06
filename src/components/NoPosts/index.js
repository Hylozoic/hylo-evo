import React from 'react'
import { useTranslation } from 'react-i18next'
import './NoPosts.scss'

import { jollyAxolotl } from 'util/assets'

const NoPosts = () => {
  const { t } = useTranslation()
  const message = t('Nothing to see here')
  return (
    <div styleName='no-posts'>
      <img src={jollyAxolotl} />
      <br />
      <div><h2>{message}</h2></div>
    </div>
  )
}

export default NoPosts
