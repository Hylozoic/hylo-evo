import { connect } from 'react-redux'
import { push, goBack } from 'connected-react-router'
import getMe from 'store/selectors/getMe'
import trackAnalyticsEvent from 'store/actions/trackAnalyticsEvent'
import updateUserSettings from 'store/actions/updateUserSettings'
import getReturnToURL from 'store/selectors/getReturnToURL'
import resetReturnToURL from 'store/actions/resetReturnToURL'
import { fetchLocation } from 'components/LocationInput/LocationInput.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    returnToURL: getReturnToURL(state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes)),
    goToPreviousStep: () => dispatch(push('/welcome/upload-photo')),
    goBack: () => dispatch(goBack()),
    push: (path) => dispatch(push(path)),
    resetReturnToURL: () => dispatch(resetReturnToURL()),
    trackAnalyticsEvent: (name, data) => dispatch(trackAnalyticsEvent(name, data)),
    fetchLocation: (location) => dispatch(fetchLocation(location))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToNextStep: (defaultPath = '/welcome/explore') => {
      if (stateProps.returnToURL) {
        dispatchProps.resetReturnToURL()
        dispatchProps.push(stateProps.returnToURL)
      } else {
        dispatchProps.push(defaultPath)
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
