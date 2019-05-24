import { connect } from 'react-redux'
import { goBack, push } from 'connected-react-router'
import { withRouter } from 'react-router-dom'
import { setConfirmBeforeClose } from './FullPageModal.store'
import { get } from 'lodash/fp'
import getPreviousLocation from 'store/selectors/getPreviousLocation'

export function mapStateToProps (state, props) {
  return {
    confirmMessage: get('FullPageModal.confirm', state),
    previousLocation: getPreviousLocation(state)
  }
}

export const mapDispatchToProps = {
  goBack,
  push,
  setConfirmBeforeClose
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { push, setConfirmBeforeClose } = dispatchProps
  const { goToOnClose } = ownProps
  const { confirmMessage, previousLocation } = stateProps

  const navigate = () => push(goToOnClose || previousLocation)

  const onClose = confirmMessage
    ? () => {
      if (window.confirm(confirmMessage)) {
        setConfirmBeforeClose(false)
        navigate()
      }
    }
    : navigate

  return {
    onClose,
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  }
}

export default component => withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(component))
