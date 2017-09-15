import React from 'react'
import './Loading.scss'

export default function Loading ({ type }) {
  switch (type) {
    case 'fullscreen':
      return <div styleName='loading-fullscreen'><SvgLoader /></div>
    case 'top':
      return <div styleName='loading-top'><SvgLoader /></div>
    case 'bottom':
      return <div styleName='loading-bottom'><SvgLoader /></div>
    default:
      return <div styleName='loading'><SvgLoader /></div>
  }
}

function SvgLoader () {
  return (
    <div styleName='loading-indicator'>
      <svg version='1.1' x='0px' y='0px'
        width='40px' height='40px' viewBox='0 0 50 50'>
        <path fill='#000'
          d='M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z'>
          <animateTransform attributeType='xml'
            attributeName='transform'
            type='rotate'
            from='0 25 25'
            to='360 25 25'
            dur='0.6s'
            repeatCount='indefinite' />
        </path>
      </svg>
    </div>
  )
}
