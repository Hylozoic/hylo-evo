import React from 'react'

import './PeopleSelectorMatches.scss'

const { string } = React.PropTypes

export default function PeopleSelectorMatches () {
  return <div styleName='people-selector-matches'></div>
}

PeopleSelectorMatches.propTypes = {
  example: string
}
