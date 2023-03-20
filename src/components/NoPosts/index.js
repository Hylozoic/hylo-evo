import React from 'react'
import { useTranslation } from 'react-i18next'
import './NoPosts.scss'

import { jollyAxolotl } from 'util/assets'

const NoPosts = ({ message = 'Nothing to see here', className }) => {
  const { t } = useTranslation()
  const tMessage = t(message)
  return (
    <div styleName='no-posts' className={className}>
      <img src={jollyAxolotl} />
      <br />
      <div><h2>{tMessage}</h2></div>
    </div>
  )
}

export default NoPosts
