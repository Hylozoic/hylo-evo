import React from 'react'
import './NoPosts.scss'

import { jollyAxolotl } from 'util/assets'

export default ({ message = 'Nothing to see here', className }) => (
  <div styleName='no-posts' className={className}>
    <img src={jollyAxolotl} />
    <br />
    <div><h2>{message}</h2></div>
  </div>
)
