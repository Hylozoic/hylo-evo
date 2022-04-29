import React from 'react'
import connector from './NotFound.connector'
import './NotFound.scss'

function NotFound ({ goBack, className }) {
  return (
    <div styleName='container' className={className}>
      <h3>Oops, there's nothing to see here.</h3>
      <a styleName='go-back' onClick={goBack}>Go back</a>
      <div styleName='axolotl' />
      <span styleName='footer'>404 Not Found</span>
    </div>
  )
}

export default connector(NotFound)
