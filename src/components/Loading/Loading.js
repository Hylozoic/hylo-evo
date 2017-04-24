import React from 'react'
import './Loading.scss'

export default function Loading ({ type }) {
  switch (type) {
    case 'top':
      return <div styleName='loading-top'>Loading...</div>
    default:
      return <div styleName='loading'>Loading...</div>
  }
}
