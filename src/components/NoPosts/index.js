import React from 'react'
import './NoPosts.scss'

import { jollyAxolotl } from 'util/assets'

export default ({message = 'Nothing to see here'}) => (
  <div styleName='no-posts'>
    <img src={jollyAxolotl} />
    <br />
    <div><h2>{message}</h2></div>
  </div>
)
