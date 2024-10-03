import { connect } from 'react-redux'
import { push, goBack } from 'redux-first-history'
import getMe from 'store/selectors/getMe'
import trackAnalyticsEvent from 'store/actions/trackAnalyticsEvent'
import updateUserSettings from 'store/actions/updateUserSettings'
import { fetchLocation } from 'components/LocationInput/LocationInput.store'
import getReturnToPath from 'store/selectors/getReturnToPath'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    returnToPath: getReturnToPath(state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes)),
    goToPreviousStep: () => dispatch(push('/welcome/upload-photo')),
    goBack: () => dispatch(goBack()),
    push: (path) => dispatch(push(path)),
    trackAnalyticsEvent: (name, data) => dispatch(trackAnalyticsEvent(name, data)),
    fetchLocation: (location) => dispatch(fetchLocation(location))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToNextStep: () => {
      // Skip welcome/explore if a `returnToPath` is present
      if (!stateProps.returnToPath) {
        dispatchProps.push('/welcome/explore')
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
