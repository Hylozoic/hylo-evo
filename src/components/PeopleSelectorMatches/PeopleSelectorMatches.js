import React from 'react'

import './PeopleSelectorMatches.scss'

const { string } = React.PropTypes

export default function PeopleSelectorMatches ({ matches }) {
  return <div styleName='people-selector-matches'>
    <ul>
      {matches && matches.map(match => <li>{match.name}</li>)}
    </ul>
  </div>
}

PeopleSelectorMatches.propTypes = {
}
