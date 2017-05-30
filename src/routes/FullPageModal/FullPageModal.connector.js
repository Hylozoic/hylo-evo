import { connect } from 'react-redux'
import { goBack, push } from 'react-router-redux'
import { withRouter } from 'react-router-dom'
import { setConfirmBeforeClose } from './FullPageModal.store'

export function mapStateToProps (state, props) {
  return {
    confirmMessage: state.FullPageModal.confirm
  }
}

export const mapDispatchToProps = {
  goBack,
  push,
  setConfirmBeforeClose
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { goBack, push, setConfirmBeforeClose } = dispatchProps
  const { history } = ownProps
  const { confirmMessage } = stateProps

  const navigate = history.length > 2
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
