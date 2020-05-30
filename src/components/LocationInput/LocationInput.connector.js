import { connect } from 'react-redux'
import {
  fetchLocation,
  pollingFetchLocation
} from './LocationInput.store.js'

export function mapStateToProps (state, props) {
  return {}
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchLocation,
    pollingFetchLocation: (locationData, callback) => pollingFetchLocation(dispatch, locationData, callback)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })
