import { connect } from 'react-redux'

import { matchesSelector } from './PeopleSelectorMatches.store'

export function mapStateToProps (state) {
  return {
    matches: matchesSelector(state)
  }
}

export default connect(mapStateToProps)
