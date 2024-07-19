import React from 'react'
import './Loading.scss'

export default function Loading ({ type, className, size }) {
  let styleName = 'loading'
  let finalSize = size || 40

  switch (type) {
    case 'fullscreen':
      styleName = 'loading-fullscreen'
      break
    case 'top':
      styleName = 'loading-top'
      break
    case 'bottom':
      styleName = 'loading-bottom'
      break
    case 'inline':
      styleName = 'loading-inline'
      finalSize = size || 25
      break
  }

  return <div className={className} styleName={styleName}>
    <SvgLoader size={finalSize} />
  </div>
}

function SvgLoader ({ size = 40 }) {
  return (
    <div styleName='loading-indicator'>
      <svg version='1.1' x='0px' y='0px'
        width={`${size}px`} height={`${size}px`} viewBox='0 0 50 50'>
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
