import { connect } from 'react-redux'
import { push, goBack } from 'connected-react-router'
import getMe from 'store/selectors/getMe'
import trackAnalyticsEvent from 'store/actions/trackAnalyticsEvent'
import updateUserSettings from 'store/actions/updateUserSettings'
import { fetchLocation } from 'components/LocationInput/LocationInput.store'
import getReturnToURL from 'store/selectors/getReturnToURL'

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
      if (stateProps.returnToURL) {
        // Return handling to PrimaryLayout
        dispatchProps.push('/')
      } else {
        dispatchProps.push('/welcome/explore')
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
