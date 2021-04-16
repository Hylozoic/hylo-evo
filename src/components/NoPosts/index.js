import React from 'react'
import './NoPosts.scss'

import { jollyAxolotl } from 'util/assets'

export default () => (
  <div styleName='no-posts'>
    <img src={jollyAxolotl} />
    <br />
    <div><h2>Nothing to see here</h2></div>
  </div>
)
