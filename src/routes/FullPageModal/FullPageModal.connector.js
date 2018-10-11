import { connect } from 'react-redux'
import { goBack, push } from 'react-router-redux'
import { withRouter } from 'react-router-dom'
import { setConfirmBeforeClose } from './FullPageModal.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  return {
    confirmMessage: get('FullPageModal.confirm', state)
  }
}

export const mapDispatchToProps = {
  goBack,
  push,
  setConfirmBeforeClose
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { goBack, push, setConfirmBeforeClose } = dispatchProps
  const { history, goToOnClose } = ownProps
  const { confirmMessage } = stateProps

  const navigate = goToOnClose
    ? () => push(goToOnClose)
    : history.length > 2
      ? () => goBack()
      : () => push('/')

  const onClose = confirmMessage
    ? () => {
      if (window.confirm(confirmMessage)) {
        setConfirmBeforeClose(false)
        navigate()
      }
    }
    : navigate

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onClose
  }
}

export default component => withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(component))
