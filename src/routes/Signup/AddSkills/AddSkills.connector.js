import { connect } from 'react-redux'
import { setAutocomplete, getAutocomplete, fetchSkills } from './AddSkills.store'

export function mapStateToProps (state, props) {
  const autocomplete = getAutocomplete(state)
  return {
    autocomplete
  }
}
export const mapDispatchToProps = {
  setAutocomplete,
  fetchSkills
}

export default connect(mapStateToProps, mapDispatchToProps)
