import { connect } from 'react-redux'

import { deleteMatch, fetchPeople, setAutocomplete } from './PeopleSelector.store'

export default connect(null, { deleteMatch, fetchPeople, setAutocomplete })
