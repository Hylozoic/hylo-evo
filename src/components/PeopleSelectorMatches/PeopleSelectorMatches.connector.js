import { connect } from 'react-redux'

import { addMatch } from 'components/PeopleSelector/PeopleSelector.store'
import { matchesSelector } from './PeopleSelectorMatches.store'

export function mapStateToProps (state) {
  return {
    matches: matchesSelector(state)
  }
}

export default connect(mapStateToProps, { addMatch })
